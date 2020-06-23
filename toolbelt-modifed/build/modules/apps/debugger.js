"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const get_stream_1 = tslib_1.__importDefault(require("get-stream"));
const net_1 = tslib_1.__importDefault(require("net"));
const ws_1 = tslib_1.__importDefault(require("ws"));
const env_1 = require("../../env");
const Headers_1 = require("../../lib/constants/Headers");
const SessionManager_1 = require("../../lib/session/SessionManager");
const locator_1 = require("../../locator");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const user_agent_1 = tslib_1.__importDefault(require("../../user-agent"));
const keepAliveDelayMs = 3 * 60 * 1000;
const THIRTY_SECONDS_MS = 30 * 1000;
const wsCloseCodeGoingAway = 1001;
const wsCloseCodeError = 1011;
const DEFAULT_DEBUGGER_PORT = 9229;
const MAX_RETRY_COUNT = 40;
function getErrorMessage(raw) {
    try {
        const errJson = JSON.parse(raw);
        return errJson.message || errJson.code || raw;
    }
    catch (err) {
        return raw;
    }
}
function webSocketTunnelHandler(host, path, server) {
    return (socket) => {
        socket.setKeepAlive(true, keepAliveDelayMs);
        const ws = new ws_1.default(`wss://${host}${path}`, {
            headers: {
                Authorization: SessionManager_1.SessionManager.getSingleton().checkAndGetToken(true),
                Host: host,
                'user-agent': user_agent_1.default,
                [Headers_1.Headers.VTEX_RUNTIME_API]: 'true',
                ...(env_1.cluster() ? { [Headers_1.Headers.VTEX_UPSTREAM_TARGET]: env_1.cluster() } : null),
            },
        });
        const interval = setInterval(ws.ping, THIRTY_SECONDS_MS);
        const end = () => {
            clearInterval(interval);
            ws.removeAllListeners();
            socket.removeAllListeners();
            socket.destroy();
        };
        ws.on('close', end);
        ws.on('error', err => {
            end();
            logger_1.default.error(`Debugger websocket error: ${err.name}: ${err.message}`);
        });
        ws.on('unexpected-response', async (_, res) => {
            end();
            const errMsg = getErrorMessage(await get_stream_1.default(res));
            logger_1.default.warn(`Unexpected response from debugger hook (${res.statusCode}): ${errMsg}`);
            if (res.statusCode === 401 || res.statusCode === 403) {
                logger_1.default.warn(`Got unauthorized error from remote debugger, finalizing local debugger...`);
                server.close();
            }
        });
        ws.on('message', data => {
            try {
                socket.write(data);
            }
            catch (err) {
                end();
                ws.close(wsCloseCodeError);
            }
        });
        ws.on('open', () => {
            socket.on('data', data => {
                if (ws.readyState !== ws.OPEN) {
                    logger_1.default.debug(`Tried to write to debugger websocket but it is not opened`);
                    return;
                }
                ws.send(data, err => {
                    if (err) {
                        logger_1.default.error(`Error writing to debugger websocket: ${err.name}: ${err.message}`);
                    }
                });
            });
            socket.on('close', hadError => {
                end();
                ws.close(hadError ? wsCloseCodeError : wsCloseCodeGoingAway);
            });
        });
    };
}
function startDebuggerTunnel(manifest, port = DEFAULT_DEBUGGER_PORT) {
    const { name, vendor, version, builders } = manifest;
    const { node, 'service-js': serviceJs } = builders;
    if (!node && !serviceJs) {
        return;
    }
    const { account, workspace } = SessionManager_1.SessionManager.getSingleton();
    const appMajor = locator_1.versionMajor(version);
    const host = 'app.io.vtex.com';
    const path = `/${vendor}.${name}/v${appMajor}/${account}/${workspace}/_debug/attach`;
    return new Promise((resolve, reject) => {
        const server = net_1.default.createServer();
        server.on('connection', webSocketTunnelHandler(host, path, server));
        server.on('error', err => {
            if (port < DEFAULT_DEBUGGER_PORT + MAX_RETRY_COUNT) {
                logger_1.default.warn(`Port ${port} in use, will try to open tunnel on port ${port + 1}`);
                resolve(startDebuggerTunnel(manifest, port + 1));
            }
            else {
                reject(err);
            }
        });
        server.listen(port, () => {
            const addr = server.address();
            resolve(addr.port);
        });
    });
}
exports.default = startDebuggerTunnel;

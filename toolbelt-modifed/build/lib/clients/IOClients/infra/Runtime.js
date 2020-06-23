"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const url = tslib_1.__importStar(require("url"));
const ws_1 = tslib_1.__importDefault(require("ws"));
const env_1 = require("../../../../env");
const logger_1 = tslib_1.__importDefault(require("../../../../logger"));
const Headers_1 = require("../../../constants/Headers");
const SessionManager_1 = require("../../../session/SessionManager");
const IOClientFactory_1 = require("../IOClientFactory");
const EOT = '\x04';
class Runtime {
    constructor(context) {
        const { account, workspace } = context;
        this.account = account;
        this.workspace = workspace;
    }
    static createClient() {
        return new Runtime(IOClientFactory_1.IOClientFactory.createIOContext());
    }
    async debugDotnetApp(appName, appVendor, appMajor, debugInst) {
        const host = 'app.io.vtex.com';
        const path = `/${appVendor}.${appName}/v${appMajor}/${this.account}/${this.workspace}/_debug/dotnet`;
        const clusterHeader = env_1.cluster() ? { [Headers_1.Headers.VTEX_UPSTREAM_TARGET]: env_1.cluster() } : null;
        const clientOptions = {
            headers: {
                Authorization: SessionManager_1.SessionManager.getSingleton().token,
                Host: host,
                [Headers_1.Headers.VTEX_RUNTIME_API]: 'true',
                ...clusterHeader,
            },
        };
        const urlObject = {
            protocol: 'wss',
            hostname: host,
            pathname: path,
            query: {
                inst: debugInst.split(' '),
            },
        };
        const formattedUrl = url.format(urlObject);
        const ws = new ws_1.default(formattedUrl, clientOptions);
        const wsDuplexStream = ws_1.default.createWebSocketStream(ws, { encoding: 'utf8' });
        wsDuplexStream.on('error', () => {
            logger_1.default.debug('Connection closed');
            process.exit(0);
        });
        wsDuplexStream.pipe(process.stdout);
        process.stdin.pipe(wsDuplexStream, { end: false });
        process.stdin.on('end', () => {
            wsDuplexStream.end(EOT);
        });
    }
}
exports.Runtime = Runtime;

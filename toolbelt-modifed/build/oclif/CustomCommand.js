"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const hrTimeToMs_1 = require("../lib/utils/hrTimeToMs");
const init_1 = require("./hooks/init");
const TelemetryCollector_1 = require("../lib/telemetry/TelemetryCollector");
const traceConfig_1 = require("../lib/globalConfigs/traceConfig");
const command_1 = tslib_1.__importStar(require("@oclif/command"));
class CustomCommand extends command_1.default {
    getAllArgs(rawParse) {
        return rawParse.filter(token => token.type === 'arg').map(token => token.input);
    }
    parse(options, argv) {
        const result = super.parse(options, argv);
        traceConfig_1.TraceConfig.setupTraceConfig(result.flags.trace);
        return result;
    }
    async _run() {
        let err;
        try {
            // remove redirected env var to allow subsessions to run autoupdated client
            delete process.env[this.config.scopedEnvVarKey('REDIRECTED')];
            await this.init();
            const commandStartTime = process.hrtime();
            const result = await this.run();
            const commandLatency = process.hrtime(commandStartTime);
            const commandLatencyMetric = {
                command: this.id,
                latency: hrTimeToMs_1.hrTimeToMs(commandLatency),
            };
            TelemetryCollector_1.TelemetryCollector.getCollector().registerMetric(commandLatencyMetric);
            return result;
        }
        catch (error) {
            err = error;
            await this.catch(error);
        }
        finally {
            await this.finally(err);
        }
    }
    async finally(err) {
        try {
            if (err && err.oclif === undefined)
                await init_1.onError(err);
            const { config } = require('@oclif/errors');
            if (config.errorLogger)
                await config.errorLogger.flush();
        }
        catch (error) {
            console.error(error);
        }
    }
}
exports.CustomCommand = CustomCommand;
CustomCommand.globalFlags = {
    verbose: command_1.flags.boolean({ char: 'v', description: 'Show debug level logs', default: false }),
    help: command_1.flags.help({ char: 'h' }),
    trace: command_1.flags.boolean({ description: 'Ensure all requests to VTEX IO are traced', default: false }),
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const AppLogsEventSource_1 = require("../../lib/clients/eventSources/AppLogsEventSource");
const manifest_1 = require("../../lib/manifest");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
exports.default = async (app, options) => {
    if (options.all) {
        app = '';
    }
    else if (await manifest_1.ManifestEditor.isManifestReadable()) {
        const manifest = await manifest_1.ManifestEditor.getManifestEditor();
        app = app || manifest.name;
    }
    else if (!app) {
        logger_1.default.error('App could not be specified. Did you forget --all?');
        return;
    }
    const appLogsEventSource = AppLogsEventSource_1.AppLogsEventSource.createDefault({ app, showSeenLogs: options.past });
    appLogsEventSource.createLogEventSource();
    logger_1.default.info('Press CTRL+C to abort');
};

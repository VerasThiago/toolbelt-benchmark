"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ramda_1 = require("ramda");
const Apps_1 = require("../../../lib/clients/IOClients/infra/Apps");
exports.default = async (app, field) => {
    const apps = Apps_1.createAppsClient();
    const newSettingsJson = await apps
        .getAppSettings(app)
        .then(ramda_1.dissocPath([field]))
        .then(newSettings => JSON.stringify(newSettings, null, 2));
    await apps.saveAppSettings(app, newSettingsJson);
    console.log(newSettingsJson);
};

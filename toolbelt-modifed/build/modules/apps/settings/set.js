"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ramda_1 = require("ramda");
const Apps_1 = require("../../../lib/clients/IOClients/infra/Apps");
exports.default = async (app, field, value) => {
    const apps = Apps_1.createAppsClient();
    const newSetting = {};
    newSetting[field] = value;
    const newSettingsJson = await apps
        .getAppSettings(app)
        .then(ramda_1.merge(ramda_1.__, newSetting))
        .then(newSettings => JSON.stringify(newSettings, null, 2));
    await apps.saveAppSettings(app, newSettingsJson);
    console.log(newSettingsJson);
};

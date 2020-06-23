"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ramda_1 = require("ramda");
const Apps_1 = require("../../../lib/clients/IOClients/infra/Apps");
exports.default = async (app, fields) => {
    const apps = Apps_1.createAppsClient();
    const settingsValues = await apps
        .getAppSettings(app)
        .then(settings => (fields === null ? settings : ramda_1.path(fields, settings)))
        .then(value => JSON.stringify(value, null, 2));
    console.log(settingsValues);
};

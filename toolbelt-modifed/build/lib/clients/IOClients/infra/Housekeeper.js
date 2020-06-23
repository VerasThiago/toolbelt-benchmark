"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@vtex/api");
const IOClientFactory_1 = require("../IOClientFactory");
exports.createHousekeeperClient = (customContext = {}, customOptions = {}) => {
    return IOClientFactory_1.IOClientFactory.createClient(api_1.Housekeeper, customContext, customOptions);
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
class NpmClient {
    static getPackageMetadata(name, version) {
        return axios_1.default.get(`${this.REGISTRY_BASE_URL}/${name}/${version}`).then(response => response.data);
    }
}
exports.NpmClient = NpmClient;
NpmClient.REGISTRY_BASE_URL = 'http://registry.npmjs.org';

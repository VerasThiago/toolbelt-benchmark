"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = require("os");
const path_1 = require("path");
class PathConstants {
}
exports.PathConstants = PathConstants;
PathConstants.VTEX_FOLDER = path_1.join(os_1.homedir(), '.vtex');
PathConstants.PRETASKS_FOLDER = path_1.join(PathConstants.VTEX_FOLDER, 'pretasks');
PathConstants.TELEMETRY_FOLDER = path_1.join(PathConstants.VTEX_FOLDER, 'telemetry');
PathConstants.LOGS_FOLDER = path_1.join(PathConstants.VTEX_FOLDER, 'logs');
PathConstants.SESSION_FOLDER = path_1.join(PathConstants.VTEX_FOLDER, 'session');

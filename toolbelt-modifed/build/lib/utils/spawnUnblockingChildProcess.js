"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const EnvVariables_1 = require("../constants/EnvVariables");
function spawnUnblockingChildProcess(path, args) {
    const debugMode = !!process.env[EnvVariables_1.EnvVariablesConstants.DEBUG_CP];
    const proc = child_process_1.spawn(path, args, debugMode ? { stdio: 'inherit' } : { detached: true, stdio: 'ignore' });
    if (!debugMode) {
        proc.unref();
    }
    return proc;
}
exports.spawnUnblockingChildProcess = spawnUnblockingChildProcess;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EnvVariablesConstants;
(function (EnvVariablesConstants) {
    // Activate child_process debugging: Instead of creating non-blocking child processes
    // it will create processes with stdio attached to the parent's stdio streams
    // Setting this to any string value will work: `DEBUG_CP=* vtex whoami`
    EnvVariablesConstants["DEBUG_CP"] = "DEBUG_CP";
    // Ignore CLIPreTasks checks: All checks made on CLIPreTasks will be skipped.
    // Setting this to any string value will work: `IGNORE_CLIPRETASKS=* vtex whoami`
    EnvVariablesConstants["IGNORE_CLIPRETASKS"] = "IGNORE_PRECHECKS";
})(EnvVariablesConstants = exports.EnvVariablesConstants || (exports.EnvVariablesConstants = {}));

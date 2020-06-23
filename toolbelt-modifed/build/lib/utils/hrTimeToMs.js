"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function hrTimeToMs(hrtime) {
    return 1e3 * hrtime[0] + hrtime[1] / 1e6;
}
exports.hrTimeToMs = hrTimeToMs;

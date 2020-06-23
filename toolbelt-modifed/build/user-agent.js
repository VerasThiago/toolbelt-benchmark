"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const pkg = tslib_1.__importStar(require("../package.json"));
const userAgent = `Toolbelt/${pkg.version}`;
exports.default = userAgent;

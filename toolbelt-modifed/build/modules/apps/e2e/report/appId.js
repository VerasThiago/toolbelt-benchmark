"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const ink_1 = require("ink");
const api_1 = require("@vtex/api");
exports.AppId = ({ appId }) => {
    const { name, version, build } = api_1.parseAppId(appId);
    const [vendor, app] = name.split('.');
    return (React.createElement(ink_1.Box, null,
        React.createElement(ink_1.Color, { blue: true }, vendor),
        React.createElement(ink_1.Color, { dim: true }, "."),
        `${app}@${version}`,
        build && React.createElement(ink_1.Color, { dim: true }, `+${build}`)));
};

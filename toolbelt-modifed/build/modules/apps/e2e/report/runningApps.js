"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const ink_1 = require("ink");
const appId_1 = require("./appId");
const specsState_1 = require("./specsState");
exports.Running = ({ appId, specs }) => {
    const specsReports = Object.values(specs);
    const completedSpecsCount = specsReports.reduce((acum, specReport) => {
        return acum + (specsState_1.completedSpec(specReport) ? 1 : 0);
    }, 0);
    return (React.createElement(ink_1.Box, null,
        React.createElement(ink_1.Color, { bgYellow: true, black: true }, ' RUNS '),
        React.createElement(ink_1.Box, { marginLeft: 1 },
            React.createElement(appId_1.AppId, { appId: appId })),
        React.createElement(ink_1.Box, { marginLeft: 1 },
            React.createElement(ink_1.Color, { greenBright: true }, `${completedSpecsCount} specs completed`),
            React.createElement(ink_1.Text, null, `, ${specsReports.length} total`))));
};

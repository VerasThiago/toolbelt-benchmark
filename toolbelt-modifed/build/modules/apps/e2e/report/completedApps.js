"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const ink_1 = require("ink");
const failedApps_1 = require("./failedApps");
const appId_1 = require("./appId");
const completedAppColors = (failed) => {
    if (failed) {
        return { bgRed: true, white: true };
    }
    return { bgGreen: true, black: true };
};
exports.Completed = ({ appId, specs, testId }) => {
    const failedSpecs = Object.keys(specs).reduce((acum, curSpecName) => {
        if (specs[curSpecName].state !== 'passed') {
            acum.push({ specName: curSpecName, specReport: specs[curSpecName] });
        }
        return acum;
    }, []);
    const failed = failedSpecs.length > 0;
    return (React.createElement(ink_1.Box, { flexDirection: "column" },
        React.createElement(ink_1.Box, null,
            React.createElement(ink_1.Color, Object.assign({}, completedAppColors(failed)), failed ? ' FAIL ' : ' PASS '),
            React.createElement(ink_1.Box, { marginLeft: 1 },
                React.createElement(appId_1.AppId, { appId: appId }))),
        React.createElement(ink_1.Box, { flexDirection: "column", marginLeft: 2 }, failedSpecs.map(({ specReport, specName }) => (React.createElement(failedApps_1.FailedSpec, { key: specName, spec: specName, report: specReport, hubTestId: testId }))))));
};

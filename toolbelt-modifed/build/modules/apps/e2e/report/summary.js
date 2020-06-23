"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const ink_1 = require("ink");
const ramda_1 = require("ramda");
const specsState_1 = require("./specsState");
const countPassedSpecs = (appReport) => {
    const specsState = Object.values(appReport).map(specReport => (specsState_1.passedSpec(specReport) ? 1 : 0));
    return ramda_1.sum(specsState);
};
const countPassedSpecsFromAppsTests = (appTests) => {
    return ramda_1.sum(appTests.map(countPassedSpecs));
};
const countAllSpecsFromAppsTests = (appTests) => {
    return ramda_1.sum(appTests.map(appSpecs => Object.keys(appSpecs).length));
};
exports.Summary = ({ completedAppTests, runningAppTests, testId, requestedAt, }) => {
    const passedAppsCount = completedAppTests.reduce((acum, curApp) => acum + (specsState_1.passedApp(curApp.specs) ? 1 : 0), 0);
    const completedAppTestsSpecs = completedAppTests.map(({ specs }) => specs);
    const runningAppTestsSpecs = runningAppTests.map(({ specs }) => specs);
    const passedSpecs = countPassedSpecsFromAppsTests(completedAppTestsSpecs) + countPassedSpecsFromAppsTests(runningAppTestsSpecs);
    const totalSpecs = countAllSpecsFromAppsTests(completedAppTestsSpecs) + countAllSpecsFromAppsTests(runningAppTestsSpecs);
    const [timePassed, setTimePassed] = React.useState(requestedAt ? Math.floor((Date.now() - requestedAt) / 1000) : null);
    React.useEffect(() => {
        if (timePassed == null || runningAppTests.length === 0)
            return;
        const timeout = setTimeout(() => setTimePassed(Math.floor((Date.now() - requestedAt) / 1000)), 1000);
        return () => clearTimeout(timeout);
    });
    return (React.createElement(React.Fragment, null,
        React.createElement(ink_1.Box, { flexDirection: "column", marginRight: 1 },
            React.createElement(ink_1.Text, { bold: true }, "TestId:"),
            React.createElement(ink_1.Text, { bold: true }, "Apps:"),
            React.createElement(ink_1.Text, { bold: true }, "Specs:"),
            timePassed ? React.createElement(ink_1.Text, { bold: true }, "Time:") : null),
        React.createElement(ink_1.Box, { flexDirection: "column" },
            React.createElement(ink_1.Text, null, testId),
            React.createElement(ink_1.Text, null,
                React.createElement(ink_1.Color, { greenBright: true },
                    passedAppsCount,
                    " passed"),
                ", ",
                passedAppsCount,
                " of ",
                completedAppTests.length,
                " total"),
            React.createElement(ink_1.Text, null,
                React.createElement(ink_1.Color, { greenBright: true },
                    passedSpecs,
                    " passed"),
                ", ",
                passedSpecs,
                " of ",
                totalSpecs,
                " total"),
            timePassed ? React.createElement(ink_1.Text, null, `${timePassed}s`) : null)));
};

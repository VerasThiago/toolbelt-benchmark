"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const ink_1 = require("ink");
const ramda_1 = require("ramda");
const completedApps_1 = require("./completedApps");
const summary_1 = require("./summary");
const specsState_1 = require("./specsState");
const runningApps_1 = require("./runningApps");
const Report = ({ completedAppTests, runningAppTests, testId }) => {
    return (React.createElement(ink_1.Box, { flexDirection: "column" },
        React.createElement(ink_1.Static, null, completedAppTests.map(({ appId, specs }) => (React.createElement(completedApps_1.Completed, { key: appId, appId: appId, specs: specs, testId: testId })))),
        runningAppTests.length > 0 && (React.createElement(ink_1.Box, { flexDirection: "column", marginTop: 1 }, runningAppTests.map(({ appId, specs }) => (React.createElement(runningApps_1.Running, { key: appId, appId: appId, specs: specs })))))));
};
exports.RealTimeReport = ({ testId, poll, interval, initialReport, requestedAt, }) => {
    const [delay, setDelay] = React.useState(interval);
    const [report, setReport] = React.useState(specsState_1.parseReport(initialReport));
    const handleReport = ({ completedAppTests, runningAppTests }) => {
        const recentlyCompleted = ramda_1.difference(completedAppTests, report.completedAppTests);
        setReport({
            // careful not to reorder completed apps because they are Static
            completedAppTests: [...report.completedAppTests, ...recentlyCompleted],
            runningAppTests,
        });
        if (runningAppTests.length === 0)
            setDelay(null);
    };
    React.useEffect(() => {
        // running is local to each iteration of this effect
        // so won't pollute anything if the user starts polling again
        if (delay === null) {
            return;
        }
        let running = false;
        let savedTimeout = null;
        async function tick() {
            if (!running) {
                return;
            }
            await poll()
                .then(specsState_1.parseReport)
                .then(handleReport);
            savedTimeout = setTimeout(tick, delay);
        }
        const stop = () => {
            running = false;
            const timeout = savedTimeout;
            if (timeout !== null) {
                clearTimeout(timeout);
            }
        };
        running = true;
        savedTimeout = setTimeout(tick, delay);
        return stop;
    });
    return (React.createElement(ink_1.Box, { flexDirection: "column" },
        React.createElement(Report, Object.assign({}, report, { testId: testId })),
        React.createElement(ink_1.Box, { marginTop: 1 },
            React.createElement(summary_1.Summary, Object.assign({}, report, { testId: testId, requestedAt: requestedAt })))));
};

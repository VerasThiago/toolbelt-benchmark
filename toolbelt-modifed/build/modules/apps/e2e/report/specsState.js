"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const COMPLETED_STATES = ['passed', 'failed', 'skipped', 'error'];
exports.completedSpec = (specReport) => COMPLETED_STATES.includes(specReport.state);
const completedApp = (appReport) => {
    return Object.values(appReport).every((specReport) => {
        return exports.completedSpec(specReport);
    });
};
exports.passedSpec = (specReport) => specReport.state === 'passed';
exports.passedApp = (appReport) => {
    return Object.values(appReport).every((specReport) => {
        return exports.passedSpec(specReport);
    });
};
exports.parseReport = (report) => {
    const appTests = Object.keys(report).map(appId => {
        return {
            appId,
            specs: report[appId],
        };
    });
    const completedAppTests = appTests.filter(appTest => completedApp(appTest.specs));
    const runningAppTests = appTests.filter(appTest => !completedApp(appTest.specs));
    return { completedAppTests, runningAppTests };
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const ink_1 = require("ink");
const SessionManager_1 = require("../../../../lib/session/SessionManager");
const env_1 = require("../../../../env");
const FailedSpecDetail = ({ label, text, indented }) => {
    const textLines = text.split('\n');
    return (React.createElement(ink_1.Box, { flexDirection: "column", marginBottom: 1 },
        React.createElement(ink_1.Text, null,
            React.createElement(ink_1.Text, { underline: true }, `${label}:`),
            !indented && ` ${text}`),
        indented && (React.createElement(ink_1.Box, { marginTop: 1 },
            React.createElement(ink_1.Box, { flexDirection: "column" }, textLines.map(() => '│ ')),
            React.createElement(ink_1.Box, null, text)))));
};
exports.FailedSpec = ({ spec, report, hubTestId }) => {
    var _a, _b, _c, _d;
    const { logId, specId } = report;
    const video = (_a = report.report) === null || _a === void 0 ? void 0 : _a.video;
    const screenshots = (_b = report.report) === null || _b === void 0 ? void 0 : _b.screenshots;
    const notPassedSpecs = ((_d = (_c = report.report) === null || _c === void 0 ? void 0 : _c.tests) !== null && _d !== void 0 ? _d : []).filter(({ state }) => state !== 'passed');
    const errorsVisualization = notPassedSpecs.map(({ title, testId, body, error, stack }, index) => {
        const testScreenshots = screenshots.filter(curScreenshot => curScreenshot.testId === testId);
        return (React.createElement(ErrorVisualization, { key: index, title: title, body: body, error: error, stack: stack, testScreenshots: testScreenshots, testVideo: video, specId: specId, testId: hubTestId }));
    });
    return (React.createElement(ink_1.Box, { flexDirection: "column" },
        React.createElement(ink_1.Color, { bold: true }, `${spec}:`),
        React.createElement(ink_1.Box, { flexDirection: "column", marginLeft: 2 },
            report.error && React.createElement(FailedSpecDetail, { label: "Error", text: report.error, indented: true }),
            errorsVisualization,
            specId && React.createElement(FailedSpecDetail, { label: "SpecId", text: specId, indented: false }),
            logId && React.createElement(FailedSpecDetail, { label: "LogId", text: logId, indented: false }))));
};
const workspaceBaseURL = () => {
    const { account, workspace } = SessionManager_1.SessionManager.getSingleton();
    return `https://${workspace}--${account}.${env_1.publicEndpoint()}`;
};
const ErrorVisualization = ({ title, body, error, stack, testScreenshots, testVideo, specId, testId, }) => {
    const baseURL = workspaceBaseURL();
    const testScreenshotsUrl = testScreenshots
        .map(curScreenshot => `${baseURL}/_v/screenshot/${testId}/${specId}/${curScreenshot.screenshotId}`)
        .join('\n');
    const videoUrl = testVideo === 'true' ? `${baseURL}/_v/video/${testId}/${specId}` : '';
    return (React.createElement(ink_1.Box, { key: title.join(''), flexDirection: "column" },
        React.createElement(FailedSpecDetail, { label: "Test", text: title.join(' '), indented: false }),
        body && React.createElement(FailedSpecDetail, { label: "Body", text: body, indented: true }),
        stack && React.createElement(FailedSpecDetail, { label: "Stack", text: stack, indented: true }),
        error && React.createElement(FailedSpecDetail, { label: "Error", text: error, indented: true }),
        testScreenshots.length > 0 && (React.createElement(FailedSpecDetail, { label: "Screenshots", text: testScreenshotsUrl, indented: testScreenshots.length > 1 })),
        testVideo === 'true' && React.createElement(FailedSpecDetail, { label: "Video", text: videoUrl, indented: false })));
};

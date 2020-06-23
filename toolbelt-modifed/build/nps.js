"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const enquirer_1 = tslib_1.__importDefault(require("enquirer"));
const moment_1 = tslib_1.__importDefault(require("moment"));
const opn_1 = tslib_1.__importDefault(require("opn"));
const conf_1 = require("./conf");
const prompts_1 = require("./modules/prompts");
const NPSFormURL = 'https://forms.gle/CRRHn6P3x9AeaWTQ8';
const choices = {
    'In 1 day': [1, 'days'],
    'In 1 week': [1, 'weeks'],
    'In 1 month': [1, 'months'],
    Never: [3, 'months'],
};
async function checkAndOpenNPSLink() {
    const nextFeedbackDateString = conf_1.getNextFeedbackDate();
    if (!nextFeedbackDateString) {
        // If the user is starting to use the tool, wait 1 week to ask for feedback.
        conf_1.saveNextFeedbackDate(moment_1.default()
            .add(1, 'weeks')
            .toISOString());
        return;
    }
    const nextFeedbackDate = moment_1.default(nextFeedbackDateString);
    if (moment_1.default() > nextFeedbackDate) {
        const shouldOpenFeedbackForm = await prompts_1.promptConfirm(`Help us evolve VTEX IO! Can you fill in our feedback form?`, true);
        if (shouldOpenFeedbackForm) {
            // Ask for feedback again in 3 months.
            conf_1.saveNextFeedbackDate(moment_1.default()
                .add(3, 'months')
                .toISOString());
            opn_1.default(NPSFormURL, { wait: false });
        }
        else {
            let { remindChoice } = await enquirer_1.default.prompt({
                name: 'remindChoice',
                message: 'When would you like to be reminded?',
                type: 'select',
                choices: Object.keys(choices),
            });
            const [n, unit] = choices[remindChoice];
            remindChoice = moment_1.default()
                .add(n, unit)
                .toISOString();
            conf_1.saveNextFeedbackDate(remindChoice);
        }
    }
}
exports.checkAndOpenNPSLink = checkAndOpenNPSLink;

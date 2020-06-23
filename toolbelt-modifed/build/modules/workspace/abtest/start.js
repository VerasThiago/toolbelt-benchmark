"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const enquirer_1 = tslib_1.__importDefault(require("enquirer"));
const ramda_1 = require("ramda");
const semver_1 = tslib_1.__importDefault(require("semver"));
const logger_1 = tslib_1.__importDefault(require("../../../logger"));
const prompts_1 = require("../../prompts");
const utils_1 = require("./utils");
const promptSignificanceLevel = async () => {
    const significanceTimePreviews = await Promise.all(ramda_1.compose(ramda_1.map(value => utils_1.abtester.preview(value)), ramda_1.values)(utils_1.SIGNIFICANCE_LEVELS));
    const significanceTimePreviewMap = ramda_1.fromPairs(ramda_1.zip(ramda_1.keys(utils_1.SIGNIFICANCE_LEVELS), significanceTimePreviews));
    return enquirer_1.default
        .prompt({
        name: 'level',
        message: 'Choose the significance level:',
        type: 'select',
        choices: ramda_1.values(ramda_1.mapObjIndexed((value, key) => ({
            message: `${key} (~ ${utils_1.formatDays(value)})`,
            value: key,
        }))(significanceTimePreviewMap)),
    })
        .then(ramda_1.prop('level'));
};
const promptContinue = (workspace, significanceLevel) => {
    return significanceLevel
        ? prompts_1.promptConfirm(`You are about to start an A/B test between workspaces \
${chalk_1.default.green('master')} and ${chalk_1.default.green(workspace)} with \
${chalk_1.default.red(significanceLevel)} significance level. Proceed?`, false)
        : prompts_1.promptConfirm(`You are about to start an A/B test between workspaces \
${chalk_1.default.green('master')} and ${chalk_1.default.green(workspace)}. Proceed?`, false);
};
exports.default = async () => {
    const abTesterManifest = await utils_1.installedABTester();
    const workspace = await utils_1.promptProductionWorkspace('Choose production workspace to start A/B test:');
    try {
        if (semver_1.default.satisfies(abTesterManifest.version, '>=0.10.0')) {
            logger_1.default.info(`Setting workspace ${chalk_1.default.green(workspace)} to A/B test`);
            const promptAnswer = await promptContinue(workspace);
            if (!promptAnswer)
                return;
            const proportion = Number(await utils_1.promptProportionTrafic());
            const timeLength = Number(await utils_1.promptConstraintDuration());
            await utils_1.abtester.customStart(workspace, timeLength, proportion);
            logger_1.default.info(`Workspace ${chalk_1.default.green(String(workspace))} in A/B test`);
            logger_1.default.info(`You can stop the test using ${chalk_1.default.blue('vtex workspace abtest finish')}`);
            return;
        }
        const significanceLevel = await promptSignificanceLevel();
        const promptAnswer = await promptContinue(workspace, significanceLevel);
        if (!promptAnswer)
            return;
        const significanceLevelValue = utils_1.SIGNIFICANCE_LEVELS[significanceLevel];
        logger_1.default.info(`Setting workspace ${chalk_1.default.green(workspace)} to A/B test with \
        ${significanceLevel} significance level`);
        await utils_1.abtester.startLegacy(workspace, significanceLevelValue);
        logger_1.default.info(`Workspace ${chalk_1.default.green(workspace)} in A/B test`);
        logger_1.default.info(`You can stop the test using ${chalk_1.default.blue('vtex workspace abtest finish')}`);
    }
    catch (err) {
        if (err.message === 'Workspace not found') {
            console.log(`Test not initialized due to workspace ${workspace} not found by ab-tester.`);
        }
    }
};

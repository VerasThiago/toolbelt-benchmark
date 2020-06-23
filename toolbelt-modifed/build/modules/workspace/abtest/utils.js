"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const enquirer_1 = tslib_1.__importDefault(require("enquirer"));
const numbro_1 = tslib_1.__importDefault(require("numbro"));
const ramda_1 = require("ramda");
const env = tslib_1.__importStar(require("../../../env"));
const errors_1 = require("../../../errors");
const ABTester_1 = require("../../../lib/clients/IOClients/apps/ABTester");
const Apps_1 = require("../../../lib/clients/IOClients/infra/Apps");
const Workspaces_1 = require("../../../lib/clients/IOClients/infra/Workspaces");
const SessionManager_1 = require("../../../lib/session/SessionManager");
const DEFAULT_TIMEOUT = 15000;
exports.SIGNIFICANCE_LEVELS = {
    low: 0.5,
    mid: 0.7,
    high: 0.9,
};
const { account } = SessionManager_1.SessionManager.getSingleton();
const options = { timeout: (env.envTimeout || DEFAULT_TIMEOUT) };
// Clients for the 'master' workspace
exports.abtester = ABTester_1.ABTester.createClient({ workspace: 'master' }, { ...options, retries: 3 });
exports.apps = Apps_1.createAppsClient({ workspace: 'master' });
exports.formatDays = (days) => {
    let suffix = 'days';
    if (days === 1) {
        suffix = 'day';
    }
    return `${numbro_1.default(days).format('0,0')} ${suffix}`;
};
exports.formatDuration = (durationInMinutes) => {
    const minutes = durationInMinutes % 60;
    const hours = Math.trunc(durationInMinutes / 60) % 24;
    const days = Math.trunc(durationInMinutes / (60 * 24));
    return `${days} days, ${hours} hours and ${minutes} minutes`;
};
exports.installedABTester = async () => {
    try {
        return await exports.apps.getApp('vtex.ab-tester@x');
    }
    catch (e) {
        if (e.response.data.code === 'app_not_found') {
            throw new errors_1.CommandError(`The app ${chalk_1.default.yellow('vtex.ab-tester')} is \
not installed in account ${chalk_1.default.green(account)}, workspace \
${chalk_1.default.blue('master')}. Please install it before attempting to use A/B \
testing functionality`);
        }
        throw e;
    }
};
exports.promptProductionWorkspace = async (promptMessage) => {
    const workspaces = Workspaces_1.createWorkspacesClient();
    const productionWorkspaces = await workspaces.list(account).then(ramda_1.compose(ramda_1.map(({ name }) => name), ramda_1.filter(({ name, production }) => production === true && name !== 'master')));
    return enquirer_1.default
        .prompt({
        name: 'workspace',
        message: promptMessage,
        type: 'select',
        choices: productionWorkspaces,
    })
        .then(ramda_1.prop('workspace'));
};
exports.promptConstraintDuration = async () => {
    const message = 'The amount of time should be an integer.';
    return ramda_1.prop('time', await enquirer_1.default.prompt({
        name: 'proportion',
        message: "What's the amount of time respecting the restriction?",
        validate: s => /^[0-9]+$/.test(s) || message,
        filter: s => s.trim(),
        type: 'input',
    }));
};
exports.promptProportionTrafic = async () => {
    const message = 'The proportion of traffic directed to a workspace should be an integer between 0 and 10000.';
    return ramda_1.prop('proportion', await enquirer_1.default.prompt({
        name: 'proportion',
        message: `What's the proportion of traffic initially directed to workspace ${chalk_1.default.blue('master')}?
      This should be an integer between 0 and 10000 that corresponds each 1% to 100, i.e. if you want to direct 54.32% of traffic to master, this value should be 5432.
      If you don't want to fix this value, just type any value here and set the next restriction to 0.`,
        validate: s => /^([0-9]{1,4}|10000)$/.test(s) || message,
        filter: s => s.trim(),
        type: 'input',
    }));
};

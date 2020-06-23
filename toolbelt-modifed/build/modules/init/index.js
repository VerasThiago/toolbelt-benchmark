"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const enquirer_1 = tslib_1.__importDefault(require("enquirer"));
const ramda_1 = require("ramda");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const prompts_1 = require("../prompts");
const git = tslib_1.__importStar(require("./git"));
const SessionManager_1 = require("../../lib/session/SessionManager");
const VTEX_APPS = 'vtex-apps';
const VTEXInternalTemplates = [
    // Only show these templates for VTEX e-mail users.
    'graphql-example',
    'payment-provider-example',
    'admin-example',
    'delivery-theme',
    'service-example',
    'render-guide',
    'masterdata-graphql-guide',
    'support app',
    'react-guide',
];
const templates = {
    'graphql-example': {
        repository: 'graphql-example',
        organization: VTEX_APPS,
    },
    'payment-provider-example': {
        repository: 'payment-provider-example',
        organization: VTEX_APPS,
    },
    'admin-example': {
        repository: 'admin-example',
        organization: VTEX_APPS,
    },
    store: {
        repository: 'minimum-boilerplate-theme',
        organization: VTEX_APPS,
    },
    'delivery-theme': {
        repository: 'delivery-theme',
        organization: VTEX_APPS,
    },
    'service-example': {
        repository: 'service-example',
        organization: VTEX_APPS,
    },
    'render-guide': {
        repository: 'render-guide',
        organization: VTEX_APPS,
    },
    'masterdata-graphql-guide': {
        repository: 'masterdata-graphql-guide',
        organization: VTEX_APPS,
    },
    'edition app': {
        repository: 'edition-hello',
        organization: VTEX_APPS,
    },
    'support app': {
        repository: 'hello-support',
        organization: VTEX_APPS,
    },
    'react-guide': {
        repository: 'react-app-template',
        organization: VTEX_APPS,
    },
    'checkout-ui-settings': {
        repository: 'checkout-ui-settings',
        organization: VTEX_APPS,
    },
};
const getTemplates = () => 
// Return all templates if user's e-mail is `...@vtex...`.
// Otherwise filter the VTEX internal templates.
ramda_1.test(/@vtex\./, SessionManager_1.SessionManager.getSingleton().userLogged)
    ? ramda_1.keys(templates)
    : ramda_1.reject(x => VTEXInternalTemplates.indexOf(x) >= 0, ramda_1.keys(templates));
const promptTemplates = async () => {
    const cancel = 'Cancel';
    const chosen = ramda_1.prop('service', await enquirer_1.default.prompt({
        name: 'service',
        message: 'Choose where do you want to start from',
        type: 'select',
        choices: [...getTemplates(), cancel],
    }));
    if (chosen === cancel) {
        logger_1.default.info('Bye o/');
        return process.exit();
    }
    return chosen;
};
const promptContinue = async (repoName) => {
    const proceed = await prompts_1.promptConfirm(`You are about to create the new folder ${process.cwd()}/${repoName}. Do you want to continue?`);
    if (!proceed) {
        logger_1.default.info('Bye o/');
        process.exit();
    }
};
exports.default = async () => {
    logger_1.default.debug('Prompting for app info');
    logger_1.default.info('Hello! I will help you generate basic files and folders for your app.');
    try {
        const { repository: repo, organization: org } = templates[await promptTemplates()];
        await promptContinue(repo);
        logger_1.default.info(`Cloning ${chalk_1.default.bold.cyan(repo)} from ${chalk_1.default.bold.cyan(org)}.`);
        await git.clone(repo, org);
        logger_1.default.info(`Run ${chalk_1.default.bold.green(`cd ${repo}`)} and ${chalk_1.default.bold.green('vtex link')} to start developing!`);
    }
    catch (err) {
        logger_1.default.error(err.message);
        logger_1.default.debug(err);
    }
};

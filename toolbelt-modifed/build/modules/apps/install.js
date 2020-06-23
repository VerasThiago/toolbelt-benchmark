"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const ramda_1 = require("ramda");
const Apps_1 = require("../../lib/clients/IOClients/infra/Apps");
const Billing_1 = tslib_1.__importDefault(require("../../lib/clients/IOClients/apps/Billing"));
const manifest_1 = require("../../lib/manifest");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const prompts_1 = require("../prompts");
const utils_1 = require("./utils");
const { installApp } = Billing_1.default.createClient();
const { installApp: legacyInstallApp } = Apps_1.createAppsClient();
const isError = (errorCode) => ramda_1.compose(ramda_1.equals(errorCode), ramda_1.path(['response', 'status']));
const isForbiddenError = isError(403);
const isNotFoundError = isError(404);
const hasErrorMessage = ramda_1.path(['response', 'data', 'message']);
const logGraphQLErrorMessage = e => {
    logger_1.default.error('Installation failed!');
    logger_1.default.error(e.message);
};
const promptPolicies = async () => {
    return prompts_1.promptConfirm('Do you accept all the Terms?');
};
const checkBillingOptions = async (app, billingOptions, force) => {
    logger_1.default.warn(`${chalk_1.default.blue(app)} is a ${billingOptions.free ? chalk_1.default.green('free') : chalk_1.default.red('paid')} app. To install it, you need to accept the following Terms:\n\n${utils_1.optionsFormatter(billingOptions)}\n`);
    const confirm = await promptPolicies();
    if (!confirm) {
        return;
    }
    logger_1.default.info('Starting to install app with accepted Terms');
    await installApp(app, true, force);
    logger_1.default.debug('Installed after accepted terms');
};
const prepareInstall = async (appsList, force) => {
    for (const app of appsList) {
        manifest_1.ManifestValidator.validateApp(app);
        try {
            logger_1.default.debug('Starting to install app', app);
            if (app === 'vtex.billing' || ramda_1.head(app.split('@')) === 'vtex.billing') {
                // eslint-disable-next-line no-await-in-loop
                await legacyInstallApp(app);
            }
            else {
                // eslint-disable-next-line no-await-in-loop
                const { code, billingOptions } = await installApp(app, false, force);
                switch (code) {
                    case 'installed_from_own_registry':
                        logger_1.default.debug('Installed from own registry');
                        break;
                    case 'public_app':
                        logger_1.default.debug('Installed from public registry');
                        break;
                    case 'installed_by_previous_purchase':
                        logger_1.default.debug('Installed from previous purchase');
                        break;
                    case 'installed_free':
                        logger_1.default.debug('Free app');
                        break;
                    case 'check_terms':
                        if (!billingOptions) {
                            throw new Error('Failed to get billing options');
                        }
                        // eslint-disable-next-line no-await-in-loop
                        await checkBillingOptions(app, JSON.parse(billingOptions), force);
                }
            }
            logger_1.default.info(`Installed app ${chalk_1.default.green(app)} successfully`);
        }
        catch (e) {
            if (isNotFoundError(e)) {
                logger_1.default.warn(`Billing app not found in current workspace. Please install it with ${chalk_1.default.green('vtex install vtex.billing')}`);
            }
            else if (isForbiddenError(e)) {
                logger_1.default.error(`You do not have permission to install apps. Please check your VTEX IO 'Install App' resource access in Account Management`);
            }
            else if (hasErrorMessage(e)) {
                logger_1.default.error(e.response.data.message);
            }
            else {
                switch (e.message) {
                    case 'no_buy_app_license':
                        logger_1.default.error(`You do not have permission to purchase apps. Please check your VTEX IO 'Buy Apps' resource access in Account Managament`);
                        break;
                    case 'area_unavailable':
                        logger_1.default.error('Unfortunately, app purchases are not yet available in your region');
                        break;
                    default:
                        logGraphQLErrorMessage(e);
                }
            }
            logger_1.default.warn(`The following app was not installed: ${app}`);
        }
    }
};
exports.default = async (optionalApps, options) => {
    const force = options.f || options.force;
    const confirm = await utils_1.validateAppAction('install', optionalApps);
    if (!confirm)
        return;
    const appsList = optionalApps.length > 0 ? optionalApps : [(await manifest_1.ManifestEditor.getManifestEditor()).appLocator];
    logger_1.default.debug(`Installing app${appsList.length > 1 ? 's' : ''}: ${appsList.join(', ')}`);
    return prepareInstall(appsList, force);
};

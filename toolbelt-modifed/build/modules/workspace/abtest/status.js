"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const moment_1 = tslib_1.__importDefault(require("moment"));
const numbro_1 = tslib_1.__importDefault(require("numbro"));
const ramda_1 = tslib_1.__importDefault(require("ramda"));
const SessionManager_1 = require("../../../lib/session/SessionManager");
const logger_1 = tslib_1.__importDefault(require("../../../logger"));
const table_1 = require("../../../table");
const utils_1 = require("./utils");
const formatPercent = (n) => numbro_1.default(n).format('0.000%');
const formatInteger = (n) => numbro_1.default(n).format('0,0');
const bold = (stringList) => ramda_1.default.map(chalk_1.default.bold)(stringList);
const printResultsTable = (testInfo) => {
    const { ABTestBeginning, WorkspaceA, WorkspaceB, Winner, WorkspaceASessions, WorkspaceBSessions, WorkspaceASessionsLast24Hours, WorkspaceBSessionsLast24Hours, ExpectedLossChoosingA, ExpectedLossChoosingB, ConversionA, ConversionALast24Hours, ConversionB, ConversionBLast24Hours, ProbabilityAlternativeBeatMaster, 
    // PValue,
    OrdersValueA, OrdersValueB, OrdersValueALast24Hours, OrdersValueBLast24Hours, } = testInfo;
    console.log(chalk_1.default.bold(`VTEX AB Test: ${chalk_1.default.blue(`${WorkspaceA} (A)`)} vs ${chalk_1.default.blue(`${WorkspaceB} (B)`)}\n`));
    if (ramda_1.default.any(ramda_1.default.isNil)([ExpectedLossChoosingA, ExpectedLossChoosingB, ProbabilityAlternativeBeatMaster])) {
        logger_1.default.error('Unexpected value of conversion. Perhaps your user traffic is too small and this creates distortions in the data');
    }
    const rawDataTable = table_1.createTable();
    rawDataTable.push(bold(['', chalk_1.default.blue(WorkspaceA), chalk_1.default.blue(WorkspaceB)]));
    rawDataTable.push(bold(['Conversion', formatPercent(ConversionA), formatPercent(ConversionB)]));
    rawDataTable.push(bold(['Conversion (last 24h)', formatPercent(ConversionALast24Hours), formatPercent(ConversionBLast24Hours)]));
    rawDataTable.push(bold(['N. of Sessions', formatInteger(WorkspaceASessions), formatInteger(WorkspaceBSessions)]));
    rawDataTable.push(bold([
        'N. of Sessions (last 24h)',
        formatInteger(WorkspaceASessionsLast24Hours),
        formatInteger(WorkspaceBSessionsLast24Hours),
    ]));
    rawDataTable.push(bold(['Revenue', formatInteger(OrdersValueA), formatInteger(OrdersValueB)]));
    rawDataTable.push(bold(['Revenue (last 24h)', formatInteger(OrdersValueALast24Hours), formatInteger(OrdersValueBLast24Hours)]));
    const comparisonTable = table_1.createTable();
    comparisonTable.push(bold(['', chalk_1.default.blue(WorkspaceA), chalk_1.default.blue(WorkspaceB)]));
    comparisonTable.push(bold(['Expected Loss', formatPercent(ExpectedLossChoosingA), formatPercent(ExpectedLossChoosingB)]));
    const probabilitiesTable = table_1.createTable();
    probabilitiesTable.push(bold(['Event', 'Condition', 'Probability']));
    probabilitiesTable.push(bold(['B beats A', 'None', formatPercent(ProbabilityAlternativeBeatMaster)]));
    // While we're not confident in this calculation, we shouldn't show it to our users
    // probabilitiesTable.push(bold(['Data as extreme as the observed', `Workspaces being equal (both to ${chalk.blue(WorkspaceA)}).`, formatPercent(PValue)]))
    const resultsTable = table_1.createTable();
    resultsTable.push(bold([`Start Date`, `${moment_1.default(ABTestBeginning).format('DD-MMM-YYYY HH:mm')} (UTC)`]));
    const nowUTC = moment_1.default.utc();
    const runningTime = nowUTC.diff(moment_1.default.utc(ABTestBeginning), 'minutes');
    resultsTable.push(bold([`Running Time`, utils_1.formatDuration(runningTime)]));
    resultsTable.push(bold([chalk_1.default.bold.green(`Winner`), chalk_1.default.bold.green(Winner)]));
    console.log(`Raw Data:\n${rawDataTable.toString()}\n`);
    console.log(`Comparison of losses in case of choosing wrong workspace:\n${comparisonTable.toString()}\n`);
    console.log(`Probabilities:\n${probabilitiesTable.toString()}\n`);
    console.log(`Results:\n${resultsTable.toString()}\n`);
};
exports.default = async () => {
    const { account } = SessionManager_1.SessionManager.getSingleton();
    await utils_1.installedABTester();
    let abTestInfo = [];
    abTestInfo = await utils_1.abtester.status();
    if (!abTestInfo || abTestInfo.length === 0) {
        return logger_1.default.info(`No AB Tests running in account ${chalk_1.default.blue(account)}\n`);
    }
    ramda_1.default.map(printResultsTable, abTestInfo);
};

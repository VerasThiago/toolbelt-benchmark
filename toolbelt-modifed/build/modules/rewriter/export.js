"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const crypto_1 = require("crypto");
const fs_extra_1 = require("fs-extra");
const json2csv_1 = require("json2csv");
const ora_1 = tslib_1.__importDefault(require("ora"));
const readline_1 = require("readline");
const Rewriter_1 = require("../../lib/clients/IOClients/apps/Rewriter");
const SessionManager_1 = require("../../lib/session/SessionManager");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const verbose_1 = require("../../verbose");
const utils_1 = require("./utils");
const EXPORTS = 'exports';
const { account, workspace } = SessionManager_1.SessionManager.getSingleton();
const COLORS = ['cyan', 'black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'gray'];
const FIELDS = ['from', 'to', 'type', 'endDate', 'binding'];
const handleExport = async (csvPath) => {
    const indexHash = crypto_1.createHash('md5')
        .update(`${account}_${workspace}_${csvPath}`)
        .digest('hex');
    const metainfo = await fs_extra_1.readJson(utils_1.METAINFO_FILE).catch(() => ({}));
    const exportMetainfo = metainfo[EXPORTS] || {};
    const spinner = ora_1.default('Exporting redirects....').start();
    let { listOfRoutes, next } = exportMetainfo[indexHash]
        ? exportMetainfo[indexHash].data
        : { listOfRoutes: [], next: undefined };
    let count = 2;
    const listener = readline_1.createInterface({ input: process.stdin, output: process.stdout }).on('SIGINT', () => {
        utils_1.saveMetainfo(metainfo, EXPORTS, indexHash, 0, { next, listOfRoutes });
        console.log('\n');
        process.exit();
    });
    const rewriter = Rewriter_1.Rewriter.createClient();
    do {
        try {
            // eslint-disable-next-line no-await-in-loop
            const result = await rewriter.exportRedirects(next);
            listOfRoutes = listOfRoutes.concat(result.routes);
            spinner.color = COLORS[count % COLORS.length];
            spinner.text = `Exporting redirects....\t\t${listOfRoutes.length} Done`;
            next = result.next;
            count++;
        }
        catch (e) {
            utils_1.saveMetainfo(metainfo, EXPORTS, indexHash, 0, { next, listOfRoutes });
            listener.close();
            spinner.stop();
            throw e;
        }
    } while (next);
    spinner.stop();
    const json2csvParser = new json2csv_1.Parser({ fields: FIELDS, delimiter: utils_1.DELIMITER, quote: '' });
    const encodedRoutes = listOfRoutes.map((route) => ({
        ...route,
        from: utils_1.encode(route.from),
        to: utils_1.encode(route.to),
    }));
    const csv = json2csvParser.parse(encodedRoutes);
    await fs_extra_1.writeFile(`./${csvPath}`, csv);
    logger_1.default.info('Finished!\n');
    listener.close();
    utils_1.deleteMetainfo(metainfo, EXPORTS, indexHash);
};
let retryCount = 0;
exports.default = async (csvPath) => {
    try {
        await handleExport(csvPath);
    }
    catch (e) {
        logger_1.default.error('Error handling export\n');
        utils_1.showGraphQLErrors(e);
        if (verbose_1.isVerbose) {
            console.log(e);
        }
        if (retryCount >= utils_1.MAX_RETRIES) {
            process.exit();
        }
        logger_1.default.error(`Retrying in ${utils_1.RETRY_INTERVAL_S} seconds...`);
        logger_1.default.info('Press CTRL+C to abort');
        await utils_1.sleep(utils_1.RETRY_INTERVAL_S * 1000);
        retryCount++;
        await module.exports.default(csvPath);
    }
};

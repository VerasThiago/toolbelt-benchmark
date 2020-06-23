"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const crypto_1 = require("crypto");
const fs_extra_1 = require("fs-extra");
const json2csv_1 = require("json2csv");
const path_1 = require("path");
const ramda_1 = require("ramda");
const readline_1 = require("readline");
const Rewriter_1 = require("../../lib/clients/IOClients/apps/Rewriter");
const SessionManager_1 = require("../../lib/session/SessionManager");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const verbose_1 = require("../../verbose");
const delete_1 = tslib_1.__importDefault(require("./delete"));
const utils_1 = require("./utils");
const IMPORTS = 'imports';
const { account, workspace } = SessionManager_1.SessionManager.getSingleton();
const inputSchema = {
    type: 'array',
    items: {
        type: 'object',
        properties: {
            from: {
                type: 'string',
            },
            to: {
                type: 'string',
            },
            endDate: {
                type: 'string',
            },
            type: {
                type: 'string',
                enum: ['PERMANENT', 'TEMPORARY'],
            },
            binding: {
                type: 'string',
            },
        },
        additionalProperties: false,
        required: ['from', 'to', 'type'],
    },
};
const handleImport = async (csvPath) => {
    const fileHash = (await fs_extra_1.readFile(csvPath)
        .then(data => crypto_1.createHash('md5')
        .update(`${account}_${workspace}_${data}`)
        .digest('hex'))
        .catch(utils_1.handleReadError));
    const metainfo = await fs_extra_1.readJson(utils_1.METAINFO_FILE).catch(() => ({}));
    const importMetainfo = metainfo[IMPORTS] || {};
    let counter = importMetainfo[fileHash] ? importMetainfo[fileHash].counter : 0;
    const routes = await utils_1.readCSV(csvPath);
    utils_1.validateInput(inputSchema, routes);
    const routesList = utils_1.splitJsonArray(routes);
    const bar = utils_1.progressBar('Importing routes...', counter, ramda_1.length(routesList));
    const listener = readline_1.createInterface({ input: process.stdin, output: process.stdout }).on('SIGINT', () => {
        utils_1.saveMetainfo(metainfo, IMPORTS, fileHash, counter);
        console.log('\n');
        process.exit();
    });
    const rewriter = Rewriter_1.Rewriter.createClient();
    for (const redirects of routesList.splice(counter)) {
        try {
            // eslint-disable-next-line no-await-in-loop
            await rewriter.importRedirects(redirects);
        }
        catch (e) {
            // eslint-disable-next-line no-await-in-loop
            await utils_1.saveMetainfo(metainfo, IMPORTS, fileHash, counter);
            listener.close();
            throw e;
        }
        counter++;
        bar.tick();
    }
    logger_1.default.info('Finished!\n');
    listener.close();
    utils_1.deleteMetainfo(metainfo, IMPORTS, fileHash);
    return ramda_1.pluck('from', routes);
};
let retryCount = 0;
exports.default = async (csvPath, options) => {
    const reset = options ? options.r || options.reset : undefined;
    let indexedRoutes;
    let importedRoutes;
    try {
        importedRoutes = await handleImport(csvPath);
    }
    catch (e) {
        logger_1.default.error('Error handling import');
        const maybeGraphQLErrors = utils_1.showGraphQLErrors(e);
        if (verbose_1.isVerbose) {
            console.log(e);
        }
        if (retryCount >= utils_1.MAX_RETRIES || maybeGraphQLErrors) {
            process.exit();
        }
        logger_1.default.error(`Retrying in ${utils_1.RETRY_INTERVAL_S} seconds...`);
        logger_1.default.info('Press CTRL+C to abort');
        await utils_1.sleep(utils_1.RETRY_INTERVAL_S * 1000);
        retryCount++;
        importedRoutes = await module.exports.default(csvPath);
    }
    if (reset) {
        const routesToDelete = ramda_1.difference(indexedRoutes || [], importedRoutes || []);
        if (routesToDelete && !ramda_1.isEmpty(routesToDelete)) {
            const fileName = `.vtex_redirects_to_delete_${Date.now().toString()}.csv`;
            const filePath = `./${fileName}`;
            logger_1.default.info('Deleting old redirects...');
            logger_1.default.info(`In case this step fails, run 'vtex redirects delete ${path_1.resolve(fileName)}' to finish deleting old redirects.`);
            const json2csvParser = new json2csv_1.Parser({ fields: ['from'], delimiter: utils_1.DELIMITER, quote: '' });
            const csv = json2csvParser.parse(ramda_1.map(route => ({ from: route }), routesToDelete));
            await fs_extra_1.writeFile(filePath, csv);
            await delete_1.default(filePath);
            await fs_extra_1.remove(filePath);
        }
    }
    return importedRoutes;
};

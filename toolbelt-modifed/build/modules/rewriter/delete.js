"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const crypto_1 = require("crypto");
const fs_extra_1 = require("fs-extra");
const ramda_1 = require("ramda");
const readline_1 = require("readline");
const Rewriter_1 = require("../../lib/clients/IOClients/apps/Rewriter");
const SessionManager_1 = require("../../lib/session/SessionManager");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const verbose_1 = require("../../verbose");
const utils_1 = require("./utils");
const DELETES = 'deletes';
const { account, workspace } = SessionManager_1.SessionManager.getSingleton();
const inputSchema = {
    type: 'array',
    items: {
        type: 'object',
        properties: {
            from: {
                type: 'string',
            },
        },
        required: ['from'],
    },
};
const handleDelete = async (csvPath) => {
    const fileHash = (await fs_extra_1.readFile(csvPath)
        .then(data => crypto_1.createHash('md5')
        .update(`${account}_${workspace}_${data}`)
        .digest('hex'))
        .catch(utils_1.handleReadError));
    const metainfo = await fs_extra_1.readJson(utils_1.METAINFO_FILE).catch(() => ({}));
    const deletesMetainfo = metainfo[DELETES] || {};
    let counter = deletesMetainfo[fileHash] ? deletesMetainfo[fileHash].counter : 0;
    const routes = await utils_1.readCSV(csvPath);
    utils_1.validateInput(inputSchema, routes);
    const allPaths = ramda_1.map(({ from }) => from, routes);
    const separatedPaths = utils_1.splitJsonArray(allPaths);
    const bar = utils_1.progressBar('Deleting routes...', counter, ramda_1.length(separatedPaths));
    const listener = readline_1.createInterface({ input: process.stdin, output: process.stdout }).on('SIGINT', () => {
        utils_1.saveMetainfo(metainfo, DELETES, fileHash, counter);
        console.log('\n');
        process.exit();
    });
    const rewriter = Rewriter_1.Rewriter.createClient();
    for (const paths of separatedPaths.splice(counter)) {
        try {
            // eslint-disable-next-line no-await-in-loop
            await rewriter.deleteRedirects(paths);
        }
        catch (e) {
            // eslint-disable-next-line no-await-in-loop
            await utils_1.saveMetainfo(metainfo, 'deletes', fileHash, counter);
            listener.close();
            throw e;
        }
        counter++;
        bar.tick();
    }
    logger_1.default.info('Finished!\n');
    listener.close();
    utils_1.deleteMetainfo(metainfo, DELETES, fileHash);
};
let retryCount = 0;
exports.default = async (csvPath) => {
    try {
        await handleDelete(csvPath);
    }
    catch (e) {
        logger_1.default.error('Error handling delete');
        const maybeGraphQLError = utils_1.showGraphQLErrors(e);
        if (verbose_1.isVerbose) {
            console.log(e);
        }
        if (retryCount >= utils_1.MAX_RETRIES || maybeGraphQLError) {
            process.exit();
        }
        logger_1.default.error(`Retrying in ${utils_1.RETRY_INTERVAL_S} seconds...`);
        logger_1.default.info('Press CTRL+C to abort');
        await utils_1.sleep(utils_1.RETRY_INTERVAL_S * 1000);
        retryCount++;
        await module.exports.default(csvPath);
    }
};

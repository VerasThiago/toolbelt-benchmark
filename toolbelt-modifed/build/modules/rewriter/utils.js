"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ajv_1 = tslib_1.__importDefault(require("ajv"));
const crypto_1 = require("crypto");
const csvtojson_1 = tslib_1.__importDefault(require("csvtojson"));
const fs_extra_1 = require("fs-extra");
const json_array_split_1 = tslib_1.__importDefault(require("json-array-split"));
const progress_1 = tslib_1.__importDefault(require("progress"));
const ramda_1 = require("ramda");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
exports.DELIMITER = ';';
exports.MAX_ENTRIES_PER_REQUEST = 10;
exports.METAINFO_FILE = '.vtex_redirects_metainfo.json';
exports.MAX_RETRIES = 10;
exports.RETRY_INTERVAL_S = 5;
exports.sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
exports.showGraphQLErrors = (e) => {
    if (e.graphQLErrors) {
        logger_1.default.error(ramda_1.join('\n', ramda_1.pluck('message', e.graphQLErrors)));
        return true;
    }
};
exports.handleReadError = (path) => (error) => {
    console.log(JSON.stringify(error));
    logger_1.default.error(`Error reading file: ${path}`);
    logger_1.default.error(`${error.message}`);
    process.exit();
};
const normalizePath = (path) => {
    try {
        return ramda_1.compose(ramda_1.replace(/\/+$/, ''), ramda_1.toLower, decodeURI)(path);
    }
    catch (err) {
        logger_1.default.error(`Error in URI: ${path}`);
        throw err;
    }
};
const sortFunction = (redirect) => `${crypto_1.createHash('md5')
    .update(normalizePath(ramda_1.prop('from', redirect)))
    .digest('hex')}`;
exports.readCSV = async (path) => {
    try {
        const result = (await csvtojson_1.default({ delimiter: exports.DELIMITER, ignoreEmpty: true, checkType: true }).fromFile(path));
        return ramda_1.sortBy(sortFunction, result);
    }
    catch (e) {
        exports.handleReadError(path)(e);
    }
};
exports.splitJsonArray = (data) => json_array_split_1.default(data, exports.MAX_ENTRIES_PER_REQUEST);
exports.progressBar = (message, curr, total) => new progress_1.default(`${message} [:bar] :current/:total :percent`, {
    complete: '=',
    incomplete: ' ',
    width: '50',
    curr,
    total,
});
const parseErrorDataPath = (dataPath) => {
    return [ramda_1.match(/\[(.*?)\]/, dataPath)[1], ramda_1.match(/\.(.*?)$/, dataPath)[1]];
};
exports.validateInput = (schema, routes) => {
    const validate = new ajv_1.default().compile(schema);
    const isValid = validate(routes);
    if (!isValid) {
        logger_1.default.error('Errors validating input:');
        ramda_1.map(({ message, params, dataPath }) => {
            const [errorObjIndex, errorProp] = parseErrorDataPath(dataPath);
            console.error('-----');
            console.error(`${message} - in ${errorObjIndex} (${errorProp})`);
            console.error(params);
            console.error(`JSON content: \n ${JSON.stringify(routes[ramda_1.keys(routes)[errorObjIndex]], null, 2)}`);
            console.error('-----');
        }, validate.errors);
        process.exit();
    }
};
exports.saveMetainfo = (metainfo, metainfoType, fileHash, counter, data = {}) => {
    if (!metainfo[metainfoType]) {
        metainfo[metainfoType] = {};
    }
    metainfo[metainfoType][fileHash] = { counter, data };
    fs_extra_1.writeJsonSync(exports.METAINFO_FILE, metainfo, { spaces: 2 });
};
exports.deleteMetainfo = (metainfo, metainfoType, fileHash) => {
    if (!metainfo[metainfoType]) {
        return;
    }
    delete metainfo[metainfoType][fileHash];
    fs_extra_1.writeJsonSync(exports.METAINFO_FILE, metainfo, { spaces: 2 });
};
const createEncoder = (delimiter) => {
    const encoded = encodeURIComponent(delimiter);
    return (x) => x.replace(delimiter, encoded);
};
exports.encode = createEncoder(exports.DELIMITER);

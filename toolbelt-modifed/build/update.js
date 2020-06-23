"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const update_notifier_1 = tslib_1.__importDefault(require("update-notifier"));
const pkg = tslib_1.__importStar(require("../package.json"));
function updateNotify() {
    const notifier = update_notifier_1.default({ pkg, updateCheckInterval: 1000 * 60 * 60 * 1 });
    if (notifier.update && notifier.update.latest !== pkg.version) {
        const oldVersion = notifier.update.current;
        const latestVersion = notifier.update.latest;
        const changelog = `https://github.com/vtex/toolbelt/blob/master/CHANGELOG.md`;
        let { type } = notifier.update;
        switch (type) {
            case 'major':
                type = chalk_1.default.red(type);
                break;
            case 'minor':
                type = chalk_1.default.yellow(type);
                break;
            case 'patch':
                type = chalk_1.default.green(type);
                break;
        }
        notifier.notify({
            isGlobal: true,
            isYarnGlobal: true,
            message: [
                `New ${type} version of ${pkg.name} available! ${chalk_1.default.dim(oldVersion)} → ${chalk_1.default.green(latestVersion)}`,
                `${chalk_1.default.yellow('Changelog:')} ${chalk_1.default.cyan(changelog)}`,
                `Run ${chalk_1.default.green(`yarn global add ${pkg.name}`)} to update!`,
            ].join('\n'),
        });
    }
}
exports.updateNotify = updateNotify;

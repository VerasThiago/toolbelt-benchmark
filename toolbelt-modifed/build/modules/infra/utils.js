"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const ramda_1 = tslib_1.__importDefault(require("ramda"));
const semver_1 = tslib_1.__importDefault(require("semver"));
const EMPTY_STRING = '';
const stitch = (main, prerelease) => (prerelease.length > 0 ? `${main}-${prerelease}` : main);
//
// Zips all items from two lists using EMPTY_STRING for any missing items.
//
const zipLongest = (xs, ys) => {
    let l1 = xs;
    let l2 = ys;
    if (xs.length < ys.length) {
        l1 = ramda_1.default.concat(xs, ramda_1.default.repeat(EMPTY_STRING, ys.length - xs.length));
    }
    else if (ys.length < xs.length) {
        l2 = ramda_1.default.concat(ys, ramda_1.default.repeat(EMPTY_STRING, xs.length - ys.length));
    }
    return ramda_1.default.zip(l1, l2);
};
const diff = (a, b) => {
    const from = [];
    const to = [];
    let fromFormatter = x => x;
    let toFormatter = x => x;
    ramda_1.default.compose(
    // eslint-disable-next-line array-callback-return
    ramda_1.default.map(([aDigit, bDigit]) => {
        if (aDigit !== bDigit) {
            fromFormatter = x => chalk_1.default.red(x);
            toFormatter = x => chalk_1.default.green(x);
        }
        if (aDigit !== EMPTY_STRING) {
            from.push(fromFormatter(aDigit));
        }
        if (bDigit !== EMPTY_STRING) {
            to.push(toFormatter(bDigit));
        }
    }), zipLongest)(a, b);
    return [from.join('.'), to.join('.')];
};
exports.getLastStableAndPrerelease = (service) => {
    const region = Object.keys(service.versions)[0];
    const versions = service.versions[region]
        .map(semver_1.default.valid)
        .filter(v => v !== null)
        .sort(semver_1.default.compare)
        .reverse();
    const prerelease = versions.find(v => semver_1.default.prerelease(v) !== null) || '-';
    const stable = versions.find(v => semver_1.default.prerelease(v) === null) || '-';
    return [stable, prerelease];
};
exports.getTag = (version) => {
    const segments = semver_1.default.prerelease(version);
    return segments ? segments[0] : null;
};
exports.diffVersions = (a, b) => {
    const semverA = semver_1.default.parse(a);
    const semverB = semver_1.default.parse(b);
    const [aMain, bMain] = diff([semverA.major, semverA.minor, semverA.patch], [semverB.major, semverB.minor, semverB.patch]);
    const [aPre, bPre] = diff(semverA.prerelease, semverB.prerelease);
    return [stitch(aMain, aPre), stitch(bMain, bPre)];
};

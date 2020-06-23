"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const conf_1 = require("./conf");
exports.envTimeout = process.env.VTEX_API_TIMEOUT;
function colossusEndpoint() {
    return process.env.VTEX_COLOSSUS_ENDPOINT || `https://infra.io.vtex.com/colossus/v0`;
}
exports.colossusEndpoint = colossusEndpoint;
function cluster() {
    return process.env.VTEX_CLUSTER || conf_1.getCluster() || '';
}
exports.cluster = cluster;
function region() {
    return cluster() || conf_1.Region.Production;
}
exports.region = region;
function publicEndpoint() {
    return cluster() ? 'myvtexdev.com' : 'myvtex.com';
}
exports.publicEndpoint = publicEndpoint;
function clusterIdDomainInfix() {
    const upstreamCluster = cluster();
    return upstreamCluster ? `.${upstreamCluster}` : '';
}
exports.clusterIdDomainInfix = clusterIdDomainInfix;
function envCookies() {
    const upstreamCluster = cluster();
    return upstreamCluster ? `VtexIoClusterId=${upstreamCluster}` : '';
}
exports.envCookies = envCookies;

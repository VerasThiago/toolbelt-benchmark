"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@vtex/api");
const IOClientFactory_1 = require("../IOClientFactory");
var RedirectTypes;
(function (RedirectTypes) {
    RedirectTypes["PERMANENT"] = "PERMANENT";
    RedirectTypes["TEMPORARY"] = "TEMPORARY";
})(RedirectTypes = exports.RedirectTypes || (exports.RedirectTypes = {}));
class Rewriter extends api_1.AppGraphQLClient {
    constructor(context, options) {
        super('vtex.rewriter@1.x', context, {
            ...options,
            headers: { ...options.headers, 'cache-control': 'no-cache' },
            retries: 5,
            timeout: 10000,
        });
        this.exportRedirects = (next) => this.graphql
            .query({
            query: `
      query ListRedirects($next: String) {
        redirect {
          listRedirects(next: $next) {
            next
            routes {
              binding
              from
              to
              type
              endDate
            }
          }
        }
      }
      `,
            variables: { next },
        }, {
            metric: 'rewriter-get-redirects',
        })
            .then(res => { var _a, _b; return (_b = (_a = res.data) === null || _a === void 0 ? void 0 : _a.redirect) === null || _b === void 0 ? void 0 : _b.listRedirects; });
        this.importRedirects = (routes) => this.graphql
            .mutate({
            mutate: `
      mutation SaveMany($routes: [RedirectInput!]!) {
        redirect {
          saveMany(routes: $routes)
        }
      }
      `,
            variables: { routes },
        }, {
            metric: 'rewriter-import-redirects',
        })
            .then(res => { var _a, _b; return (_b = (_a = res.data) === null || _a === void 0 ? void 0 : _a.redirect) === null || _b === void 0 ? void 0 : _b.saveMany; });
        this.deleteRedirects = (paths) => this.graphql
            .mutate({
            mutate: `
      mutation DeleteMany($paths: [String!]!) {
        redirect {
          deleteMany(paths: $paths)
        }
      }
      `,
            variables: { paths },
        }, {
            metric: 'rewriter-delete-redirects',
        })
            .then(res => { var _a, _b; return (_b = (_a = res.data) === null || _a === void 0 ? void 0 : _a.redirect) === null || _b === void 0 ? void 0 : _b.deleteMany; });
    }
    static createClient(customContext = {}, customOptions = {}) {
        return IOClientFactory_1.IOClientFactory.createClient(Rewriter, customContext, customOptions);
    }
}
exports.Rewriter = Rewriter;

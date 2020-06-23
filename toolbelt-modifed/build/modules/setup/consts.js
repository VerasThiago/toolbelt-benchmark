"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Builders that use typing information
exports.BUILDERS_WITH_TYPES = ['react', 'node'];
// Builders that demand tooling installation
exports.BUILDERS_WITH_TOOLING = ['react', 'node'];
// Map of dependencies for the whole project and for each builder
exports.DEPENDENCIES = {
    // Common dependencies between projects
    common: {
        '@vtex/prettier-config': '^0.1.3',
        eslint: '^6.8.0',
        'eslint-config-vtex': '^12.2.1',
        'lint-staged': '^10.0.2',
        husky: '^4.2.0',
        prettier: '^1.19.1',
        typescript: '^3.7.5',
    },
    react: {
        'eslint-config-vtex-react': '^6.2.1',
    },
    node: {
        '@types/node': '^12.12.21',
    },
};
exports.CONTENT_ESLINT_IGNORE = `
node_modules/
coverage/
*.snap.ts
`;
exports.CONTENT_PRETTIER_RC = `@vtex/prettier-config`;
exports.CONTENT_BASE_ESLINT_RC = {
    extends: 'vtex',
    root: true,
    env: {
        node: true,
        es6: true,
        jest: true,
    },
};
exports.CONTENT_ESLINT_RC_BUILDERS = {
    react: {
        extends: 'vtex-react/io',
        env: {
            browser: true,
            es6: true,
            jest: true,
        },
    },
};

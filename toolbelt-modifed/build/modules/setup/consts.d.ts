export declare const BUILDERS_WITH_TYPES: string[];
export declare const BUILDERS_WITH_TOOLING: string[];
export declare const DEPENDENCIES: {
    common: {
        '@vtex/prettier-config': string;
        eslint: string;
        'eslint-config-vtex': string;
        'lint-staged': string;
        husky: string;
        prettier: string;
        typescript: string;
    };
    react: {
        'eslint-config-vtex-react': string;
    };
    node: {
        '@types/node': string;
    };
};
export declare const CONTENT_ESLINT_IGNORE = "\nnode_modules/\ncoverage/\n*.snap.ts\n";
export declare const CONTENT_PRETTIER_RC = "@vtex/prettier-config";
export declare const CONTENT_BASE_ESLINT_RC: {
    extends: string;
    root: boolean;
    env: {
        node: boolean;
        es6: boolean;
        jest: boolean;
    };
};
export declare const CONTENT_ESLINT_RC_BUILDERS: {
    react: {
        extends: string;
        env: {
            browser: boolean;
            es6: boolean;
            jest: boolean;
        };
    };
};

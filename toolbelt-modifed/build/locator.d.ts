export declare const versionMajor: (version: string) => string;
export declare const toMajorRange: (version: string) => string;
export declare const toAppLocator: ({ vendor, name, version }: import("@vtex/api").AppManifest) => string;
export declare const parseLocator: (locator: string) => import("@vtex/api").AppManifest;
export declare const removeVersion: (appId: string) => string;

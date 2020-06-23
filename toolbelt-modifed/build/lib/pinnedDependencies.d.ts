export interface PinnedDeps {
    common: {
        [depName: string]: string;
    };
    builders: {
        [builder: string]: {
            [majorLocator: string]: {
                [depName: string]: string;
            };
        };
    };
}
export declare const fixBuilderFolderPinnedDeps: (appRoot: string, builder: string, builderPinnedDeps: Record<string, string>) => Promise<void>;
export declare const fixPinnedDependencies: (pinnedDeps: PinnedDeps, buildersToFixDeps: string[], manifestBuilders: Record<string, string>) => Promise<void>;

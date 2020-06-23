export declare const configDir: string;
export declare enum Environment {
    Production = "prod"
}
export declare const CLUSTER_DEFAULT_VALUE = "";
export declare const ENV_DEFAULT_VALUE = Environment.Production;
export declare const saveEnvironment: (env: Environment) => void;
export declare const saveStickyHost: (appName: string, stickyHost: string) => void;
export declare const getStickyHost: (appName: string) => {
    stickyHost: string;
    lastUpdated: Date;
};
export declare const hasStickyHost: (appName: string) => boolean;
export declare const getNextFeedbackDate: () => string;
export declare const saveNextFeedbackDate: (date: string) => void;
export declare const getEnvironment: () => Environment;
export declare enum Region {
    Production = "aws-us-east-1"
}
export declare const saveCluster: (cluster: string) => void;
export declare const getCluster: () => any;

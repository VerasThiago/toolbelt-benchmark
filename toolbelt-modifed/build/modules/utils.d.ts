export declare const yarnPath: string;
export declare const formatNano: (nanoseconds: number) => string;
export declare const runYarn: (relativePath: string, force: boolean) => void;
export declare const runYarnIfPathExists: (relativePath: string) => void;
export declare const matchedDepsDiffTable: (title1: string, title2: string, deps1: string[], deps2: string[]) => any;

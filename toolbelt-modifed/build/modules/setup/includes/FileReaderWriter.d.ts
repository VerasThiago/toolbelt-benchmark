declare type Files = 'tsconfig' | 'eslintrc' | 'packageJson' | 'eslintIgnore' | 'prettierrc';
export declare class FileReaderWriter {
    private file;
    private isJSON;
    constructor(file: Files, isJSON?: boolean);
    path: (builder: string) => string;
    read: (builder: string) => any;
    write: (builder: string, data: any) => void;
}
export {};

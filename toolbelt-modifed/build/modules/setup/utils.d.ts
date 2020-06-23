import { FileReaderWriter } from './includes/FileReaderWriter';
export declare const packageJsonEditor: FileReaderWriter;
export declare const eslintrcEditor: FileReaderWriter;
export declare const tsconfigEditor: FileReaderWriter;
export declare const eslintIgnoreEditor: FileReaderWriter;
export declare const prettierrcEditor: FileReaderWriter;
export declare const checkIfTarGzIsEmpty: (url: string) => Promise<unknown>;
/**
 * Reads and parses the root package.json file
 *
 * @export
 * @returns The package.json object
 */
export declare function getRootPackageJson(): Record<string, any>;
/**
 * Checks if every dev dependency of a dependency map is installed in a package.json
 * @param {{ deps: Record<string, string>; pkg: PackageJSON }} { deps, pkg }
 * @returns {boolean}
 */
export declare function hasDevDependenciesInstalled({ deps, pkg }: {
    deps: Record<string, string>;
    pkg: Record<string, any>;
}): boolean;
/**
 * Sort the given object. Useful for sorting the `package.json` dependencies
 */
export declare function sortObject<T extends object>(obj: T): T;

import { PackageJson } from '../packageJson';
interface PackageMetadata extends PackageJson {
    deprecated?: string;
}
export declare class NpmClient {
    private static REGISTRY_BASE_URL;
    static getPackageMetadata(name: string, version: string): Promise<PackageMetadata>;
}
export {};

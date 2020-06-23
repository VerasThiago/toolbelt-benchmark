export declare class ManifestValidator {
    static readonly namePattern = "[\\w_-]+";
    static readonly vendorPattern = "[\\w_-]+";
    static readonly versionPattern = "\\d+\\.\\d+\\.\\d+(-.*)?";
    static readonly wildVersionPattern = "\\d+\\.((\\d+\\.\\d+)|(\\d+\\.x)|x)(-.*)?";
    static readonly majorVersionLocatorPattern = "\\d+\\.((\\d+\\.\\d+)|(\\d+\\.x)|x)(-.*)?";
    static readonly appID: RegExp;
    static readonly dependencyName: RegExp;
    static readonly appLocator: RegExp;
    static validate(manifest: any): void;
    static validateApp(app: string, skipVersion?: boolean): string;
}

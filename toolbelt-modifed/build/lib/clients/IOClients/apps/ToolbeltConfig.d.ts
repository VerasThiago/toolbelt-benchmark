import { InstanceOptions, IOClient, IOContext } from '@vtex/api';
import { NodeToRender } from '@vtex/toolbelt-message-renderer';
interface VersionCheckRes {
    minVersion: string;
    validVersion: boolean;
    message: string;
}
interface GlobalConfig {
    config: Record<string, any>;
    messages: Record<string, NodeToRender>;
}
export declare class ToolbeltConfig extends IOClient {
    static readonly DEFAULT_TIMEOUT = 30000;
    private static readonly PUBLIC_PATH_PREFIX;
    private static readonly GLOBAL_CONFIG_PATH;
    private static readonly VERSION_VALIDATE_PATH;
    static createClient(customContext?: Partial<IOContext>, customOptions?: Partial<InstanceOptions>): ToolbeltConfig;
    constructor(context: IOContext, options?: InstanceOptions);
    versionValidate(toolbeltVersion: string): Promise<VersionCheckRes>;
    getGlobalConfig(): Promise<GlobalConfig>;
}
export {};

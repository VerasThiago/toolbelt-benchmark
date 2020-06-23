import { AppGraphQLClient, InstanceOptions, IOContext } from '@vtex/api';
export interface RedirectInput {
    id: string;
    from: string;
    to: string;
    endDate: string;
    type: RedirectTypes;
    binding: string;
}
export interface Redirect {
    from: string;
    to: string;
    endDate: string;
    type: RedirectTypes;
    binding: string;
}
export declare enum RedirectTypes {
    PERMANENT = "PERMANENT",
    TEMPORARY = "TEMPORARY"
}
export interface ExportResponse {
    routes: Redirect[];
    next: string;
}
export declare class Rewriter extends AppGraphQLClient {
    static createClient(customContext?: Partial<IOContext>, customOptions?: Partial<InstanceOptions>): Rewriter;
    constructor(context: IOContext, options: InstanceOptions);
    exportRedirects: (next?: string) => Promise<ExportResponse>;
    importRedirects: (routes: RedirectInput[]) => Promise<boolean>;
    deleteRedirects: (paths: string[]) => Promise<boolean>;
}

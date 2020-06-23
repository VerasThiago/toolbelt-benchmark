import { AppManifest, InstanceOptions, IOClient, IOContext } from '@vtex/api';
export interface EditionInfo extends AppManifest {
    id: string;
    title: string;
    _publicationDate: string;
    _activationDate: string;
}
export declare class Sponsor extends IOClient {
    static createClient(customContext?: Partial<IOContext>, customOptions?: Partial<InstanceOptions>): Sponsor;
    private account;
    private workspace;
    constructor(context: IOContext, options: InstanceOptions);
    getSponsorAccount(): Promise<string>;
    getEdition(): Promise<EditionInfo>;
    setEdition(account: string, workspace: string, editionApp: string): Promise<void>;
    private get routes();
}

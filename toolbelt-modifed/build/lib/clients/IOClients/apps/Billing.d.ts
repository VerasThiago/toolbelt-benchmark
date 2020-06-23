import { AppClient, InstanceOptions, IOContext } from '@vtex/api';
export default class Billing extends AppClient {
    static createClient(customContext?: Partial<IOContext>, customOptions?: Partial<InstanceOptions>): Billing;
    constructor(ioContext: IOContext, opts: InstanceOptions);
    installApp: (appName: string, termsOfUseAccepted: boolean, force: boolean) => Promise<InstallResponse>;
}

import { AppClient, InstanceOptions, IOContext } from '@vtex/api';
export declare class Lighthouse extends AppClient {
    private static readonly TIMEOUT_MS;
    static createClient(customContext?: Partial<IOContext>, customOptions?: Partial<InstanceOptions>): Lighthouse;
    constructor(ioContext: IOContext, opts?: InstanceOptions);
    /**
     * This request a Lightouse audit for a url. Lighthouse audit process runs on the current workspace
     *
     * @param url The url that lightouse must audit
     */
    runAudit(url: string): Promise<ShortReportObject[]>;
    /**
     * Returns a list of previous lighthouse reports stored on masterdata
     *
     * @param app App name to filter query results
     * @param url Url to filter query results
     */
    getReports(app: string, url: string): Promise<LighthouseReportDoc[]>;
}
export interface LighthouseReportDoc {
    app: string;
    version: string;
    url: string;
    generatedAt: number;
    additionalReport: AdditionalReportObject;
    shortReport: ShortReportObject[];
}
export interface ShortReportObject {
    audits: ShortAuditObject[];
    score: number;
    title: string;
}
interface ShortAuditObject {
    title: string;
    description: string;
    score: number;
    scoreDisplayValue: string;
    numericValue: number;
    displayValue: string;
    weight: 3;
}
interface AdditionalReportObject {
    userAgent: string;
    environment: any;
    lighthouseVersion: string;
    fetchTime: string;
    requestedUrl: string;
    finalUrl: string;
    runWarnings: any[];
    configSettings: any;
    categoryGroups: any;
    timing: any;
    i18n: any;
    stackPacks: any[];
}
export {};

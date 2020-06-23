export declare class TraceConfig {
    static jaegerDebugID: string;
    static traceFlag: boolean;
    static setShouldTrace(): void;
    static setupTraceConfig(traceFlag: boolean): void;
    static shouldTrace(): boolean;
}

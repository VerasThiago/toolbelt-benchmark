export declare class Token {
    token: string | undefined;
    private decoded;
    constructor(token: string);
    get login(): any;
    isValid(): boolean;
}

interface SetupOpts {
    i?: boolean;
    'ignore-linked'?: boolean;
    all?: boolean;
    tooling?: boolean;
    typings?: boolean;
    tsconfig?: boolean;
}
declare const _default: (opts: SetupOpts) => Promise<void>;
export default _default;

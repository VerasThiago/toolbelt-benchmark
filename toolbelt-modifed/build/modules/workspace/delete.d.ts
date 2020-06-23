import { Workspaces } from '@vtex/api';
export declare const deleteWorkspaces: (workspacesClient: Workspaces, account: string, names?: any[]) => Promise<string[]>;
declare const _default: (names: string[], options: any) => Promise<void | import("winston").Logger>;
export default _default;

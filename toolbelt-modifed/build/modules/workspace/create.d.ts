import { Workspaces } from '@vtex/api';
import { WorkspaceCreator } from '../../lib/session/WorkspaceCreator';
export declare const handleErrorCreatingWorkspace: (targetWorkspace: string, err: any) => void;
export declare const workspaceExists: (account: string, workspace: string, workspacesClient: Workspaces) => Promise<boolean>;
export declare const workspaceCreator: WorkspaceCreator;

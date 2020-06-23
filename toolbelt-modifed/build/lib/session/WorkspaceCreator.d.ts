interface WorkspaceCreatorInput {
    targetWorkspace: string;
    productionWorkspace?: boolean;
    promptCreation?: boolean;
    logIfAlreadyExists?: boolean;
    clientContext?: {
        token: string;
        workspace: string;
        account: string;
    };
}
export declare type WorkspaceCreateResult = 'exists' | 'created' | 'cancelled' | 'error';
export declare type WorkspaceCreator = (input: WorkspaceCreatorInput) => Promise<WorkspaceCreateResult>;
export {};

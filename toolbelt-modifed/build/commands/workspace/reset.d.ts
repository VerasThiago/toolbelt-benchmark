import { CustomCommand } from '../../oclif/CustomCommand';
export default class WorkspaceReset extends CustomCommand {
    static description: string;
    static examples: string[];
    static flags: {
        production: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        yes: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        verbose: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        trace: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
    };
    static args: {
        name: string;
        required: boolean;
    }[];
    run(): Promise<void>;
}

import { CustomCommand } from '../../oclif/CustomCommand';
export default class DepsList extends CustomCommand {
    static aliases: string[];
    static description: string;
    static examples: string[];
    static flags: {
        keys: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        npm: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        verbose: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        trace: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
    };
    static args: any[];
    run(): Promise<void>;
}

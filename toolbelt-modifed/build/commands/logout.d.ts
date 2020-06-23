import { CustomCommand } from '../oclif/CustomCommand';
export default class Logout extends CustomCommand {
    static description: string;
    static examples: string[];
    static flags: {
        verbose: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        trace: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
    };
    static args: any[];
    run(): Promise<void>;
}

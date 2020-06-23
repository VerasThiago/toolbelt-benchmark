import { CustomCommand } from '../../oclif/CustomCommand';
export default class UnitTest extends CustomCommand {
    static description: string;
    static aliases: string[];
    static examples: any[];
    static flags: {
        unsafe: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        verbose: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        trace: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
    };
    static args: any[];
    run(): Promise<void>;
}

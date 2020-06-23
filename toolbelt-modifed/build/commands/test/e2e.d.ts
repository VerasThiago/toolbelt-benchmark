import { flags as oclifFlags } from '@oclif/command';
import { CustomCommand } from '../../oclif/CustomCommand';
export default class E2E extends CustomCommand {
    static description: string;
    static examples: any[];
    static flags: {
        report: oclifFlags.IOptionFlag<string>;
        workspace: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        token: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        verbose: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        trace: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
    };
    static args: any[];
    run(): Promise<void>;
}

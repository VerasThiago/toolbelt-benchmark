import { flags as oclifFlags } from '@oclif/command';
import { CustomCommand } from '../oclif/CustomCommand';
export default class Login extends CustomCommand {
    static description: string;
    static examples: string[];
    static flags: {
        workspace: oclifFlags.IOptionFlag<string>;
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

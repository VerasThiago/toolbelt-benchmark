import { flags as oclifFlags } from '@oclif/command';
import { CustomCommand } from '../oclif/CustomCommand';
export default class Publish extends CustomCommand {
    static description: string;
    static examples: string[];
    static flags: {
        tag: oclifFlags.IOptionFlag<string>;
        workspace: oclifFlags.IOptionFlag<string>;
        force: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        yes: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        verbose: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        trace: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
    };
    run(): Promise<void>;
}

import { flags as oclifFlags } from '@oclif/command';
import { CustomCommand } from '../../oclif/CustomCommand';
export default class ShowReports extends CustomCommand {
    static description: string;
    static examples: string[];
    static aliases: string[];
    static flags: {
        app: oclifFlags.IOptionFlag<string>;
        url: oclifFlags.IOptionFlag<string>;
        verbose: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        trace: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
    };
    run(): Promise<void>;
}

import { CustomCommand } from '../oclif/CustomCommand';
export default class Link extends CustomCommand {
    static description: string;
    static examples: any[];
    static flags: {
        clean: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        setup: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        'no-watch': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        unsafe: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        verbose: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        trace: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
    };
    static args: any[];
    run(): Promise<void>;
}

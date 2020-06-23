import { CustomCommand } from '../oclif/CustomCommand';
export default class Setup extends CustomCommand {
    static description: string;
    static flags: {
        'ignore-linked': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        all: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        typings: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        tooling: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        tsconfig: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        verbose: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        trace: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
    };
    static args: any[];
    run(): Promise<void>;
}

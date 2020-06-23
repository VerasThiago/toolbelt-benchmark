import { CustomCommand } from '../oclif/CustomCommand';
export default class Add extends CustomCommand {
    static description: string;
    static examples: string[];
    static flags: {
        verbose: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        trace: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
    };
    static strict: boolean;
    static args: ({
        name: string;
        required: boolean;
        multiple?: undefined;
    } | {
        name: string;
        required: boolean;
        multiple: boolean;
    })[];
    run(): Promise<void>;
}

import { CustomCommand } from '../../oclif/CustomCommand';
export default class ConfigSet extends CustomCommand {
    static description: string;
    static aliases: any[];
    static examples: string[];
    static flags: {
        verbose: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        trace: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
    };
    static args: ({
        name: string;
        required: boolean;
        options: string[];
    } | {
        name: string;
        required: boolean;
        options?: undefined;
    })[];
    run(): Promise<void>;
}

import { CustomCommand } from '../../oclif/CustomCommand';
export default class SettingsGet extends CustomCommand {
    static description: string;
    static aliases: string[];
    static examples: string[];
    static flags: {
        verbose: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        trace: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
    };
    static args: ({
        name: string;
        required: boolean;
    } | {
        name: string;
        required?: undefined;
    })[];
    run(): Promise<void>;
}

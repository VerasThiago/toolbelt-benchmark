import { ParsingToken } from '@oclif/parser/lib/parse';
import * as Parser from '@oclif/parser';
import OclifCommand from '@oclif/command';
export declare abstract class CustomCommand extends OclifCommand {
    static globalFlags: {
        verbose: Parser.flags.IBooleanFlag<boolean>;
        help: Parser.flags.IBooleanFlag<void>;
        trace: Parser.flags.IBooleanFlag<boolean>;
    };
    getAllArgs(rawParse: ParsingToken[]): string[];
    protected parse<F, A extends {
        [name: string]: any;
    }>(options?: Parser.Input<F>, argv?: string[]): Parser.Output<F, A>;
    _run<T>(): Promise<T | undefined>;
    finally(err: any): Promise<any>;
}

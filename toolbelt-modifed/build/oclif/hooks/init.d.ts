import { HookKeyOrOptions } from '@oclif/config/lib/hooks';
export declare const onError: (e: any) => Promise<void>;
export default function (options: HookKeyOrOptions<'init'>): Promise<void>;

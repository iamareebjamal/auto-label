import { Context } from 'probot';
export interface Config {
    labels: string[];
    labelMapping: {
        [key: string]: string[];
    };
    pr?: Config;
    issue?: Config;
}
export declare const defaultConfig: Config;
export declare function getConfig(context: Context): Promise<Config>;

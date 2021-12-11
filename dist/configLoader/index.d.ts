interface Config {
    entry: string;
    port: number;
    alias?: {
        [key: string]: string;
    };
}
/**
 *  解析config为配置对象
 * @param {string} configPath 文件地址
 * @author chris lee
 * @Time 2021/06/20
 */
export declare const configLoader: (configPath: string) => Promise<Config>;
export {};

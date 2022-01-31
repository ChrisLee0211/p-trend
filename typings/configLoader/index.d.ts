import { Config } from "../types/global";
interface CommandOptions {
    config?: string;
    port?: number;
    entry?: string;
}
/**
 * 格式化配置信息，最后输出最终配置
 * @param defaultConfig 默认配置
 * @param cmdOptions 命令行对象
 * @returns {Config}
 * @author chris lee
 * @Time 2021/12/25
 */
export declare const normalizeConfig: (defaultConfig: Config, cmdOptions: CommandOptions) => Promise<Config>;
export {};

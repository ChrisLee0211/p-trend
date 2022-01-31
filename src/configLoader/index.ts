import { Config } from "../types/global";
import { checkFileIsBuilt } from "../utils/file";
import { checkPathIsUseful, concatPath, getCurrentPath } from "../utils/path";
interface CommandOptions {
    config?: string;
    port?:number;
    entry?:string;
}

/**
 *  解析config为配置对象
 * @param {string} configPath 文件地址
 * @author chris lee
 * @Time 2021/06/20
 */
const configLoader = (configPath:string):Promise<Config> => {
    return new Promise((rs,rj) => {
        import(`${configPath}`).then((res:Config) => {
            rs(res);
        },(err) => {
            rj(err);
        });
    });
};

/**
 * 格式化配置信息，最后输出最终配置
 * @param defaultConfig 默认配置
 * @param cmdOptions 命令行对象
 * @returns {Config}
 * @author chris lee
 * @Time 2021/12/25
 */
export const normalizeConfig = async (defaultConfig:Config, cmdOptions:CommandOptions):Promise<Config> => {
    let result = {...defaultConfig};
    try{
        const commandOptions = Object.keys(cmdOptions);
        let configPath;
        /** 判断是否使用了'-c'命令输入了配置文件路径 */
        if(commandOptions.includes('config')) {
            if(!cmdOptions.config) {
                throw new Error(`Can not found config, please check if it is exist`);
            }
            configPath = cmdOptions.config;
        } else {
            /** 否则按默认读取 */
            configPath = 'p-trend.config.js';
        }
        if (checkPathIsUseful(configPath)) {
            try{
                const fullPath = concatPath(getCurrentPath(),configPath);
                const isExist = await checkFileIsBuilt(fullPath);
                if(!isExist){
                    throw new Error(`Can not find config file by wrong path, please check if it is exist`);
                }
                const config = await configLoader(fullPath);
                result = {...result, ...config};
            }catch(e){
                console.error(e);
            }
        }
        if(commandOptions.includes('entry')) {
            result.entry = cmdOptions.entry as string;
        }
        if(commandOptions.includes('port')) {
            result.port = cmdOptions.port as number;
        }
    }catch(e){
        console.error(e);
    }
    return result;
};
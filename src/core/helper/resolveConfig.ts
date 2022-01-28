import { Config } from "@/types/global";

/**
 * 判断是否存在路径别名
 * @param alias 
 * @returns 
 * @author chris lee
 * @Time 2022/01/28
 */
export function isAliasExist(alias:Config['alias']): alias is {[k:string]:string} {
    if(Object.keys(alias??{}).length) return true;
    return false;
}
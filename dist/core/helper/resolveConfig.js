"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAliasExist = void 0;
/**
 * 判断是否存在路径别名
 * @param alias
 * @returns
 * @author chris lee
 * @Time 2022/01/28
 */
function isAliasExist(alias) {
    if (Object.keys(alias !== null && alias !== void 0 ? alias : {}).length)
        return true;
    return false;
}
exports.isAliasExist = isAliasExist;

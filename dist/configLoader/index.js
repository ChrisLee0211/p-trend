"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeConfig = void 0;
const file_1 = require("../utils/file");
const path_1 = require("../utils/path");
/**
 *  解析config为配置对象
 * @param {string} configPath 文件地址
 * @author chris lee
 * @Time 2021/06/20
 */
const configLoader = (configPath) => {
    return new Promise((rs, rj) => {
        Promise.resolve().then(() => require(`${configPath}`)).then((res) => {
            rs(res);
        }, (err) => {
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
exports.normalizeConfig = (defaultConfig, cmdOptions) => __awaiter(void 0, void 0, void 0, function* () {
    let result = Object.assign({}, defaultConfig);
    try {
        const commandOptions = Object.keys(cmdOptions);
        let configPath;
        /** 判断是否使用了'-c'命令输入了配置文件路径 */
        if (commandOptions.includes('config')) {
            if (!cmdOptions.conifg) {
                throw new Error(`Can not found config, please check if it is exist`);
            }
            configPath = cmdOptions.conifg;
        }
        else {
            /** 否则按默认读取 */
            configPath = 'p-trend.config.js';
        }
        if (path_1.checkPathIsUseful(configPath)) {
            try {
                const fullPath = path_1.concatPath(path_1.getCurrentPath(), configPath);
                const isExist = yield file_1.checkFileIsBuilt(fullPath);
                if (!isExist) {
                    throw new Error(`Can not find conifg file by wrong path, please check if it is exist`);
                }
                const config = yield configLoader(fullPath);
                result = Object.assign(Object.assign({}, result), config);
            }
            catch (e) {
                console.error(e);
            }
        }
        if (commandOptions.includes('entry')) {
            result.entry = cmdOptions.entry;
        }
        if (commandOptions.includes('port')) {
            result.port = cmdOptions.port;
        }
    }
    catch (e) {
        console.error(e);
    }
    return result;
});
//# sourceMappingURL=index.js.map
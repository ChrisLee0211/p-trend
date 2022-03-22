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
exports.PraserCtr = void 0;
const file_1 = require("../../utils/file");
/**
 * 依赖路径解析器
 */
class PraserCtr {
    constructor() {
        this.plugins = [];
        // this.collectImportNodes.bind(this);
        this.parseDependency.bind(this);
        this.registerPlugins.bind(this);
    }
    /**
     * 根据对应的fileNode读取文件解析依赖
     * @param node 解析依赖路径的目标节点
     * @returns {array} 依赖路径数组
     * @author chris lee
     * @Time 2021/07/20
     */
    parseDependency(node) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = [];
            const pathname = node.path;
            const len = this.plugins.length;
            if (len) {
                try {
                    for (let i = 0; i < len; i++) {
                        const plugin = this.plugins[i];
                        let isMatch = false;
                        if (typeof (plugin.rule) === 'function') {
                            isMatch = plugin.rule(pathname);
                        }
                        else {
                            isMatch = plugin.rule.test(pathname);
                        }
                        if (plugin.exclude) {
                            let isExclude = false;
                            if (typeof (plugin.exclude) === 'function') {
                                isExclude = plugin.exclude(pathname);
                            }
                            else {
                                isExclude = plugin.exclude.test(pathname);
                            }
                            if (isExclude)
                                continue;
                        }
                        if (isMatch) {
                            const content = yield file_1.readFileContent(pathname, { encoding: 'utf8' });
                            result = yield plugin.collector(content);
                            break;
                        }
                    }
                }
                catch (e) {
                    console.error(`Fail to resolve ${pathname}! Need other plugin to parse file.`);
                }
            }
            else {
                return result;
            }
            return result;
        });
    }
    registerPlugins(plugin) {
        this.plugins.push(plugin);
    }
}
exports.PraserCtr = PraserCtr;

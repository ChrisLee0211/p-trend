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
const core_1 = require("@swc/core");
const path = require("path");
const constant_1 = require("../constant");
const swcParser_1 = require("./swcParser");
function isAliasExist(alias) {
    if (Object.keys(alias !== null && alias !== void 0 ? alias : {}).length)
        return true;
    return false;
}
/**
 * 依赖路径解析器
 */
class PraserCtr {
    constructor(alias, npmDeps, externals) {
        this.alias = {};
        this.npmDeps = [];
        this.externals = [];
        this.alias = alias !== null && alias !== void 0 ? alias : {};
        this.npmDeps = npmDeps !== null && npmDeps !== void 0 ? npmDeps : [];
        this.externals = externals !== null && externals !== void 0 ? externals : [];
        this.collectImportNodes.bind(this);
        this.parseDependency.bind(this);
        this.normalizePaths.bind(this);
        this.filterEnabledPath.bind(this);
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
            if (constant_1.enablePraseType.includes(path.extname(pathname)) === false)
                return result;
            try {
                const content = yield file_1.readFileContent(pathname, { encoding: 'utf8' });
                const depPaths = yield this.collectImportNodes(content);
                const depPathsWithoutNpmDeps = this.filterEnabledPath(depPaths);
                result = this.normalizePaths(depPathsWithoutNpmDeps, node);
            }
            catch (e) {
                console.error(e);
            }
            return result;
        });
    }
    /**
     * 过滤出可解析依赖
     * @param depsPath 依赖路径数组
     * @returns 不包含npm以及cdn等外部依赖的路径数组
     * @author chris lee
     * @Time 2021/12/11
     */
    filterEnabledPath(depsPath) {
        return depsPath.filter((depPath) => {
            const pathSplit = depPath.split(path.sep);
            const root = pathSplit[0];
            return !this.npmDeps.includes(root) && !this.externals.includes(root);
        });
    }
    /**
     * 格式化各路径为绝对路径
     * @param depPaths 依赖路径数组
     * @param fileNode 本次解析的目标节点
     * @returns {array} 依赖路径数组
     * @author chris lee
     * @Time 2021/07/20
     */
    normalizePaths(depPaths, fileNode) {
        const result = [];
        if (!depPaths.length)
            return result;
        const aliasKey = Object.keys(this.alias || {});
        // todo: 根据目前文件路径和相对路径拼接出绝对路径
        for (let i = 0; i < depPaths.length; i++) {
            const dependencePath = depPaths[i];
            const splitPath = dependencePath.split(path.sep);
            // 先判断有没有路径别名
            if (aliasKey.length) {
                let isResolve = false;
                for (let a = 0; a < aliasKey.length; a++) {
                    if (splitPath.includes(aliasKey[a])) {
                        const replaceSplitPath = splitPath.map((p) => {
                            if (p === aliasKey[a] && isAliasExist(this.alias))
                                return this.alias[aliasKey[a]];
                            return p;
                        });
                        const absolutePath = path.resolve(path.join(...replaceSplitPath));
                        result.push(absolutePath);
                        isResolve = true;
                        break;
                    }
                }
                if (isResolve) {
                    continue;
                }
            }
            // 分两种情况处理路径拼接：
            // 情况一： 属于xxx/yy/index.js or yy/ss/index.ts 文件中引用
            // 情况二： 属于xxx/ss.js 文件中的引用
            let filefolderPath = '';
            if (constant_1.rootFileEnum.includes(path.basename(fileNode.path))) {
                const baseName = path.basename(fileNode.path);
                filefolderPath = fileNode.path.split(baseName)[0];
            }
            else {
                filefolderPath = fileNode.path.split(fileNode.name)[0];
            }
            const absolutePath = path.resolve(filefolderPath, dependencePath);
            if (!result.includes(absolutePath)) {
                result.push(absolutePath);
            }
        }
        return result;
    }
    /**
     * 将目标代码转为ast后收集依赖
     * @param code 解析目标代码内容
     * @returns
     * @author chris lee
     * @Time 2021/07/20
     * @update 2022/01/08 全面替换为swc实现编译收集
     */
    collectImportNodes(code) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!code)
                return [];
            const result = [];
            const collectPath = (path) => {
                result.push(path);
            };
            const prasePlugin = new swcParser_1.SWCVisitor(collectPath);
            yield core_1.transform(code, {
                plugin: (m) => prasePlugin.visitProgram(m),
                jsc: {
                    parser: {
                        syntax: 'typescript',
                    }
                }
            });
            return result;
        });
    }
}
exports.PraserCtr = PraserCtr;

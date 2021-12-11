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
exports.ScanerCtr = void 0;
const file_1 = require("../../utils/file");
const path = require("path");
const stack_1 = require("../../utils/stack");
const constant_1 = require("../constant");
const file_2 = require("../../utils/file");
/**
 * 模块扫描器
 */
class ScanerCtr {
    constructor(entry) {
        this.fileNodes = [];
        this.fileTree = null;
        this.dependenceNodes = [];
        this.entry = entry;
    }
    /**
     * 标记当前节点为依赖节点并生成对应文件信息,同时也将依赖节点的路径收集到当前扫描节点中
     * @param target 需要记录的目标节点
     * @param currentFileNode 当前扫描节点
     * @author chris lee
     * @Time 2021/07/20
     * @update 2021/07/25 增加对依赖节点的文件大小、修改时间等记录
     * @TODO depNode的path有问题，需要排查
     */
    markDependenceNode(target, currentFileNode) {
        return __awaiter(this, void 0, void 0, function* () {
            const idx = this.dependenceNodes.findIndex((node) => node.path === target.path);
            // 如果不是重复节点，则直接新增
            if (idx === -1) {
                let normalizeDepNode = Object.assign({}, target);
                if (target.canResolve) {
                    try {
                        const fileInfo = yield file_1.readFileBasicInfo(target.path);
                        normalizeDepNode = Object.assign(Object.assign({}, target), fileInfo);
                    }
                    catch (e) {
                        console.error(`Fail to resolve parh '${target.path}'`);
                    }
                }
                this.dependenceNodes.push(normalizeDepNode);
            }
            else {
                // 如果是重复节点，
                if (this.dependenceNodes[idx].reference.findIndex(fnode => fnode.path === currentFileNode.path) === -1) {
                    this.dependenceNodes[idx].reference.push(currentFileNode);
                }
            }
            this.collectDeps(currentFileNode, target);
        });
    }
    /**
     * 比对依赖文件节点和扫描所得文件节点，分析出未被引用的文件
     * @returns {FileNode} 未被引用的节点
     * @author chris lee
     * @Time 2021/07/20
     */
    diff() {
        const dependenceNodesPaths = [...this.dependenceNodes].map(d => d.path);
        const allFileNodes = [...this.fileNodes];
        const len = allFileNodes.length;
        const result = [];
        for (let i = 0; i < len; i++) {
            const currentNode = allFileNodes[i];
            if (!dependenceNodesPaths.includes(currentNode.path)) {
                result.push(currentNode);
            }
        }
        return result;
    }
    /**
     * 根据路径返回模块名称
     * @param path 路径
     * @returns {string}
     * @author chris lee
     * @Time 2021/08/17
     */
    getModuleName(filePath) {
        const rootFileBasicNames = constant_1.rootFileEnum;
        const baseName = path.basename(filePath);
        const splitPath = filePath.split(path.sep);
        if (rootFileBasicNames.includes(baseName)) {
            return `${splitPath[splitPath.length - 2]}${path.sep}${baseName}`;
        }
        else {
            return splitPath[splitPath.length - 1];
        }
    }
    /**
     * 根据路径和名称组装fileNode唯一的moduleId用于比较
     * @param filePath 路径
     * @param name 文件名
     * @author chris lee
     * @Time 2021/12/10
     */
    getModuleId(filePath, name) {
        const extName = path.extname(name);
        if (extName.length) {
            const moudleName = name.replace(extName, '');
            const normalizePath = filePath.replace(name, '').split(path.sep).join('-');
            return normalizePath + moudleName;
        }
        else {
            return filePath.split(path.sep).join('-');
        }
    }
    /**
     * 根据初始化的entry开始以深度遍历方式扫描文件
     * @param effectFn 扫描文件节点时执行副作用回调
     * @param ctx 副作用函数本身的上下文
     * @author chris lee
     * @Time 2021/07/20
     */
    scan(effectFn, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stack = new stack_1.Stack();
                const files = yield file_1.scanFolder(this.entry);
                if (files.length) {
                    for (let i = 0; i < files.length; i++) {
                        const isFolder = files[i].isDirectory();
                        const name = files[i].name;
                        const filePath = path.resolve(this.entry, files[i].name);
                        const moduleId = this.getModuleId(filePath, name);
                        const curNode = {
                            name, isFolder, path: filePath, deps: [], moduleId
                        };
                        stack.push(curNode);
                        this.fileNodes.push(curNode);
                    }
                }
                while (stack.length) {
                    const currentFileNode = stack.pop();
                    if (currentFileNode.isFolder) {
                        const files = yield file_1.scanFolder(currentFileNode.path);
                        if (files.length) {
                            for (let i = 0; i < files.length; i++) {
                                const isFolder = files[i].isDirectory();
                                const filePath = path.resolve(currentFileNode.path, files[i].name);
                                const name = this.getModuleName(filePath);
                                const basicInfo = yield file_1.readFileBasicInfo(filePath);
                                const moduleId = this.getModuleId(filePath, name);
                                const curNode = {
                                    name,
                                    isFolder,
                                    path: filePath,
                                    deps: [],
                                    fileSize: basicInfo.size,
                                    utime: basicInfo.mtime,
                                    ctime: basicInfo.ctime,
                                    moduleId,
                                };
                                stack.push(curNode);
                                this.fileNodes.push(curNode);
                            }
                        }
                    }
                    else {
                        // 传给外部parser解析出import的内容，获取到一组有import路径组成的数组
                        let dependenceFilePaths = [];
                        if (effectFn) {
                            const cb = effectFn.bind(ctx);
                            dependenceFilePaths = yield cb(currentFileNode);
                        }
                        // 解析这组数组每一个路径，查看是否真的有index文件，然后构造成fileNode存起来
                        const dependenceFilePathsNums = dependenceFilePaths.length;
                        for (let i = 0; i < dependenceFilePathsNums; i++) {
                            const curPath = dependenceFilePaths[i];
                            const pathExtname = path.extname(curPath);
                            let depNode = null;
                            // 只要后缀名不为空，那就是一个包含文件名的绝对路径
                            if (pathExtname !== '') {
                                const fileName = this.getModuleName(curPath);
                                const moduleId = this.getModuleId(curPath, fileName);
                                depNode = {
                                    name: fileName,
                                    path: curPath,
                                    reference: [currentFileNode],
                                    canResolve: true,
                                    moduleId,
                                };
                            }
                            else {
                                // 如果没有后缀名，则为类似"../../sl"的引用，尝试拼接后缀名再校验
                                const extNames = [...constant_1.rootFileEnum, ...constant_1.enablePraseType];
                                let hasDone = false;
                                try {
                                    // 先尝试拼接为目录后接index
                                    for (let e = 0; e < extNames.length; e++) {
                                        const extName = extNames[e];
                                        let fullPath = '';
                                        if (constant_1.enablePraseType.includes(extName)) {
                                            fullPath = curPath + extName;
                                        }
                                        else {
                                            fullPath = path.join(curPath, extName);
                                        }
                                        const isExist = yield file_1.checkFileIsBuilt(fullPath);
                                        if (isExist) {
                                            const fileName = this.getModuleName(fullPath);
                                            const moduleId = this.getModuleId(fullPath, fileName);
                                            depNode = {
                                                name: fileName,
                                                path: fullPath,
                                                reference: [currentFileNode],
                                                canResolve: true,
                                                moduleId
                                            };
                                            hasDone = true;
                                            break;
                                        }
                                    }
                                    if (hasDone === false) {
                                        // 如果始终没找到文件，则意味着该文件不是一个js可以识别的模块
                                        // 直接取文件路径末尾作为名字
                                        const fileName = this.getModuleName(curPath);
                                        const moduleId = this.getModuleId(curPath, fileName);
                                        depNode = {
                                            name: fileName,
                                            path: curPath,
                                            reference: [currentFileNode],
                                            canResolve: false,
                                            moduleId
                                        };
                                    }
                                }
                                catch (e) {
                                    console.error(e);
                                }
                            }
                            if (depNode !== null) {
                                // 记录到被依赖节点中
                                yield this.markDependenceNode(depNode, currentFileNode);
                            }
                        }
                    }
                }
            }
            catch (e) {
                console.error(e);
            }
            // 因为是DFS，所以最终所有文件节点都是一个文件，因此所有节点扫描完以后把文件家类型节点过滤，避免最终diff时被计算
            this.fileNodes = [...this.fileNodes].filter((file) => file.isFolder === false);
        });
    }
    /**
     * 将依赖路径收集到当前扫描的fileNode中
     * @param currentFileNode 进行依赖收集的file节点
     * @param depNode 从文件内容中解析出来的依赖节点
     * @returns {FileNode}
     */
    collectDeps(currentFileNode, depNode) {
        const depPaths = currentFileNode.deps.map((dep) => dep.path);
        const normalizeReference = depNode.reference.map((fNode) => {
            return {
                path: fNode.path,
                name: fNode.name
            };
        });
        const normalizeDepNode = Object.assign({}, depNode);
        normalizeDepNode.reference = normalizeReference;
        if (depPaths.includes(depNode.path) === false) {
            currentFileNode.deps.push(normalizeDepNode);
        }
    }
    /**
     * 构建文件结构树
     */
    buildFileTree() {
        return __awaiter(this, void 0, void 0, function* () {
            const stack = new stack_1.Stack();
            this.fileTree = {
                name: this.entry,
                path: this.entry,
                isFolder: true,
                children: [],
                moduleId: ''
            };
            stack.push(this.fileTree);
            try {
                while (stack.length) {
                    const curNode = stack.pop();
                    if (curNode.isFolder) {
                        const files = yield file_1.scanFolder(curNode.path);
                        if (files.length) {
                            for (let i = 0; i < files.length; i++) {
                                const isFolder = files[i].isDirectory();
                                const filePath = path.resolve(curNode.path, files[i].name);
                                const name = this.getModuleName(filePath);
                                const moduleId = this.getModuleId(filePath, name);
                                const nodeContent = {
                                    name,
                                    path: filePath,
                                    isFolder,
                                    children: [],
                                    moduleId,
                                };
                                curNode.children.push(nodeContent);
                                stack.push(nodeContent);
                            }
                        }
                        const basicInfo = yield file_1.readFileBasicInfo(curNode.path);
                        curNode.fileSize = basicInfo.size;
                    }
                }
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    /**
     * 删除指定路径的文件（单个）
     * @param {string[]} paths
     * @returns {boolean}
     * @author chris lee
     * @Time 2021/11/02
     */
    removeFileNode(path) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield file_2.removeFile(path);
                if (res) {
                    const newFileNodes = [];
                    // 清理fileNodes
                    for (let i = 0; i < this.fileNodes.length; i++) {
                        const curNode = this.fileNodes[i];
                        if (curNode.deps.some(depNode => depNode.path === path)) {
                            continue;
                        }
                        if (curNode.path === path) {
                            continue;
                        }
                        newFileNodes.push(curNode);
                    }
                    this.fileNodes = newFileNodes;
                    // 重新构建fileTree
                    yield this.buildFileTree();
                    return res;
                }
                return res;
            }
            catch (e) {
                console.error(e);
                return false;
            }
        });
    }
}
exports.ScanerCtr = ScanerCtr;
//# sourceMappingURL=index.js.map
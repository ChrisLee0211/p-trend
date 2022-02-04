import { scanFolder, readFileBasicInfo } from '../../utils/file';
import * as path from "path";
import { Stack } from '../../utils/stack';
import { Config, DependenceNode, FileNode, FileTree, Scaner } from 'src/types/global';
import { removeFile } from '../../utils/file';
import { PraserCtr } from '../praser';
import { Dirent } from 'fs';
import { isAliasExist } from '../helper/resolveConfig';

/**
 * 模块扫描器
 */
export class ScanerCtr implements Scaner {
    entry: string
    alias: Config['alias'] = {}
    fileNodes: FileNode[] = [];
    fileTree: FileTree | null = null;
    dependenceNodes: DependenceNode[] = [];
    npmDepsMap: Record<string,{count:number,reference:string[]}> = {};
    private npmRegs:Array<{name:string, rule:RegExp}> = [];
    externals: string[] = []
    constructor(entry: string, alias?: { [key: string]: string }, npmDeps?: string[], externals?: string[]) {
        this.alias = alias ?? {};
        this.entry = entry;
        this.npmDepsMap = this.initNpmMaps(npmDeps||[]);
        this.externals = externals ?? [];
        this.normalizePaths.bind(this);
        this.filterEnabledPath.bind(this);
        this.collectNpmDeps.bind(this);
    }

    /**
     * 标记当前节点为依赖节点并生成对应文件信息,同时也将依赖节点的路径收集到当前扫描节点中
     * @param target 需要记录的目标节点
     * @param currentFileNode 当前扫描节点
     * @author chris lee
     * @Time 2021/07/20
     * @update 2021/07/25 增加对依赖节点的文件大小、修改时间等记录
     */
    async markDependenceNode(target: DependenceNode, currentFileNode: FileNode): Promise<void> {
        const idx = this.dependenceNodes.findIndex(
            (node) => node.path === target.path
        );
        // 如果不是重复节点，则直接新增
        if (idx === -1) {
            let normalizeDepNode: DependenceNode = { ...target };
            if (target.canResolve) {
                try {
                    const fileInfo = await readFileBasicInfo(target.path);
                    normalizeDepNode = { ...target, ...fileInfo };
                } catch (e) {
                    console.error(e);
                    console.error(`Fail to resolve path '${target.path}'`);
                }
            }
            this.dependenceNodes.push(normalizeDepNode);
        } else {
            // 如果是重复节点，
            if (this.dependenceNodes[idx].reference.findIndex(fnode => fnode.path === currentFileNode.path) === -1) {
                this.dependenceNodes[idx].reference.push(currentFileNode);
            }
        }
        this.collectDeps(currentFileNode, target);
    }
    /**
     * 比对依赖文件节点和扫描所得文件节点，分析出未被引用的文件
     * @returns {FileNode} 未被引用的节点
     * @author chris lee
     * @Time 2021/07/20
     */
    diff(): FileNode[] {
        const dependenceNodesPaths = [...this.dependenceNodes].map(d => d.path);
        const allFileNodes = [...this.fileNodes];
        const len = allFileNodes.length;
        const result: FileNode[] = [];
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
    private getModuleName(filePath: string): string {
        const reg = /^(index)(\.).*$/;
        const baseName = path.basename(filePath);
        const splitPath = filePath.split(path.sep);
        if (baseName.match(reg) && splitPath.length > 1) {
            return `${splitPath[splitPath.length - 2]}${path.sep}${baseName}`;
        } else {
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
    private getModuleId(filePath: string, name: string) {
        const extName = path.extname(name);
        if (extName.length) {
            const moudleName = name.replace(extName, '');
            const normalizePath = filePath.replace(name, '').split(path.sep).join('-');
            return normalizePath + moudleName;
        } else {
            return filePath.split(path.sep).join('-');
        }
    }

    /**
     * 过滤出可解析依赖
     * @param depsPath 依赖路径数组
     * @param currentFileNode 当前正在分析的文件节点
     * @returns 不包含npm以及cdn等外部依赖的路径数组
     * @author chris lee
     * @Time 2021/12/11
     */
    private filterEnabledPath(depsPath: string[], currentFileNode: FileNode): string[] {
        const depByNpm:string[] = this.collectNpmDeps(depsPath,currentFileNode);
        return depsPath.filter((depPath) => {
            return !depByNpm.includes(depPath) || !this.externals.includes(depPath);
        });
    }

    /**
     * 收集并记录每个npm包的引用次数及引用路径
     * @param deps 当前文件内所有依赖名称
     * @param fileNode 当前正在分析的文件节点
     * @returns {stirng[]} 返回属于npm包的依赖
     * @author chris lee
     * @Time 2022/02/04
     */
    private collectNpmDeps(deps:string[],fileNode:FileNode):string[] {
        const result:string[] = [];
        const quantity = deps.length;
        const npmQuantity = this.npmRegs.length;
        for(let i = 0; i< quantity; i++) {
            const dep = deps[i];
            for(let k = 0; k < npmQuantity;k++) {
                const npm = this.npmRegs[k];
                const npmName = npm.name;
                const rule = npm.rule;
                if (rule.test(dep)) {
                    if (npmName in this.npmDepsMap) {
                        const prevCount = this.npmDepsMap[npmName].count;
                        const prevReference = this.npmDepsMap[npmName].reference;
                        this.npmDepsMap[npmName] = {
                            count:prevCount+1,
                            reference:[...prevReference, fileNode.path],
                        };

                    }
                    result.push(dep);
                    break;
                }
            }
        }
        return result;
    }

    /**
     * 初始化npm包到map中，后续用于计数被引用的依赖
     * @param npmDeps npm包列表
     * @returns 
     * @author chris lee
     * @Time 2022/01/30
     */
    private initNpmMaps(npmDeps:string[]) {
        const map:Record<string,{count:number,reference:string[]}> = {};
        const len = npmDeps.length;
        const isNoNpmRegsEmpty = this.npmRegs.length === 0;
        for(let i=0;i < len; i++) {
            const npmName = npmDeps[i];
            map[npmName] = {count:0,reference:[]};
            if (isNoNpmRegsEmpty) {
                this.npmRegs.push({name:npmName, rule:new RegExp(`(${npmName}(?!-).*)$`,'ig')});
            }
        }
        return map;
    }

    /*
     * 格式化各路径为绝对路径
     * @param depPaths 依赖路径数组
     * @param fileNode 本次解析的目标节点
     * @returns {array} 依赖路径数组
     * @author chris lee
     * @Time 2021/07/20
     */
    private normalizePaths(depPaths: string[], fileNode: FileNode): string[] {
        const result: string[] = [];
        if (!depPaths.length) return result;
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
                            if (p === aliasKey[a] && isAliasExist(this.alias)) return this.alias[aliasKey[a]];
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
            const indexReg = /^(index)(\.).*$/;
            if (indexReg.test(path.basename(fileNode.path))) {
                const baseName = path.basename(fileNode.path);
                filefolderPath = fileNode.path.split(baseName)[0];
            } else {
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
     * 根据初始化的entry开始以深度遍历方式扫描文件
     * @param effectFn 扫描文件节点时执行副作用回调
     * @param ctx 副作用函数本身的上下文
     * @author chris lee
     * @Time 2021/07/20
     */
    async scan(effectFn?: (FileNode) => Promise<string[]>, ctx?: PraserCtr): Promise<void> {
        try {
            const stack = new Stack();
            const files = await scanFolder(this.entry);
            if (files.length) {
                for (let i = 0; i < files.length; i++) {
                    const isFolder = files[i].isDirectory();
                    const name = files[i].name;
                    const filePath = path.resolve(this.entry, files[i].name);
                    const moduleId = this.getModuleId(filePath, name);
                    const curNode: FileNode = {
                        name, isFolder, path: filePath, deps: [], moduleId
                    };
                    stack.push(curNode);
                    this.fileNodes.push(curNode);
                }
            }
            while (stack.length) {
                const currentFileNode = stack.pop() as FileNode;
                if (currentFileNode.isFolder) {
                    const files = await scanFolder(currentFileNode.path);
                    if (files.length) {
                        for (let i = 0; i < files.length; i++) {
                            const isFolder = files[i].isDirectory();
                            const filePath = path.resolve(currentFileNode.path, files[i].name);
                            const name = this.getModuleName(filePath);
                            const basicInfo = await readFileBasicInfo(filePath);
                            const moduleId = this.getModuleId(filePath, name);
                            const curNode: FileNode = {
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
                } else {
                    // 传给外部parser解析出import的内容，获取到一组有import路径组成的数组
                    let dependenceFilePaths: string[] = [];
                    if (effectFn) {
                        const cb = effectFn.bind(ctx);
                        const depPaths = await cb(currentFileNode);
                        const depPathsWithoutNpmDeps = this.filterEnabledPath(depPaths,currentFileNode);
                        dependenceFilePaths = this.normalizePaths(depPathsWithoutNpmDeps, currentFileNode);

                    }
                    // 解析这组数组每一个路径，查看是否真的有index文件，然后构造成fileNode存起来
                    const dependenceFilePathsNums: number = dependenceFilePaths.length;
                    for (let i = 0; i < dependenceFilePathsNums; i++) {
                        const curPath = dependenceFilePaths[i];
                        const pathExtname = path.extname(curPath);
                        let depNode: DependenceNode | null = null;
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
                        } else {
                            // 没有后缀名时，进一步解析到最终路径
                            const depsFiles: Dirent[] = [];
                            let hasDone = false;
                            try {
                                const dirArray = await scanFolder(curPath);
                                const size = dirArray.length;
                                if (size > 0) {
                                    for (let i = 0; i < size; i++) {
                                        depsFiles.push(dirArray[i]);
                                    }
                                }
                            } catch (e) {
                                // if throw error that means not a folder
                                hasDone = false;
                            }
                            if (depsFiles.length) {
                                const reg = /^(index)(\.).*$/;
                                const indexFile = depsFiles.find((dir) => {
                                    const basename = path.basename(dir.name);
                                    return basename.match(reg);
                                });
                                if (indexFile) {
                                    const fullPath = path.join(curPath,indexFile.name);
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
                        if (depNode !== null) {
                            // 记录到被依赖节点中
                            await this.markDependenceNode(depNode, currentFileNode);
                        }
                    }
                }
            }
        } catch (e) {
            console.error(e);
        }
        // 因为是DFS，所以最终所有文件节点都是一个文件，因此所有节点扫描完以后把文件家类型节点过滤，避免最终diff时被计算
        this.fileNodes = [...this.fileNodes].filter((file) => file.isFolder === false);
    }

    /**
     * 将依赖路径收集到当前扫描的fileNode中
     * @param currentFileNode 进行依赖收集的file节点
     * @param depNode 从文件内容中解析出来的依赖节点
     * @returns {FileNode}
     */
    collectDeps(currentFileNode: FileNode, depNode: DependenceNode): void {
        const depPaths = currentFileNode.deps.map((dep) => dep.path);
        const normalizeReference = depNode.reference.map((fNode) => {
            return {
                path: fNode.path,
                name: fNode.name
            };
        });
        const normalizeDepNode = { ...depNode };
        normalizeDepNode.reference = normalizeReference as FileNode[];
        if (depPaths.includes(depNode.path) === false) {
            currentFileNode.deps.push(normalizeDepNode);
        }
    }

    /**
     * 构建文件结构树
     */
    async buildFileTree(): Promise<void> {
        const stack = new Stack();
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
                const curNode = stack.pop() as FileTree;
                if (curNode.isFolder) {
                    const files = await scanFolder(curNode.path);
                    if (files.length) {
                        for (let i = 0; i < files.length; i++) {
                            const isFolder = files[i].isDirectory();
                            const filePath = path.resolve(curNode.path, files[i].name);
                            const name = this.getModuleName(filePath);
                            const moduleId = this.getModuleId(filePath, name);
                            const nodeContent: FileTree = {
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
                    const basicInfo = await readFileBasicInfo(curNode.path);
                    curNode.fileSize = basicInfo.size;
                }
            }
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * 删除指定路径的文件（单个）
     * @param {string[]} paths
     * @returns {boolean}
     * @author chris lee
     * @Time 2021/11/02
     */
    async removeFileNode(path: string): Promise<boolean> {
        try {
            const res = await removeFile(path);
            if (res) {
                const newFileNodes: FileNode[] = [];
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
                await this.buildFileTree();
                return res;
            }
            return res;
        } catch (e) {
            console.error(e);
            return false;
        }
    }
}
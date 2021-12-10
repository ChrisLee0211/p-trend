import {scanFolder,checkFileIsBuilt, readFileBasicInfo} from '../../utils/file';
import * as path from "path";
import {Stack} from '../../utils/stack';
import { DependenceNode, FileNode, FileTree, Scaner } from 'src/types/global';
import { enablePraseType, rootFileEnum } from '../constant';
import { removeFile } from '../../utils/file';

/**
 * 模块扫描器
 */
export class ScanerCtr implements Scaner {
    entry:string
    fileNodes:FileNode[] = [];
    fileTree:FileTree | null = null;
    dependenceNodes:DependenceNode[] = [];
    constructor(entry:string){
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
    async markDependenceNode(target:DependenceNode, currentFileNode:FileNode):Promise<void>{
        const idx = this.dependenceNodes.findIndex(
            (node) => node.path === target.path
            );
            // 如果不是重复节点，则直接新增
        if(idx === -1) {
            let normalizeDepNode:DependenceNode = {...target};
            if (target.canResolve) {
                try{
                    const fileInfo = await readFileBasicInfo(target.path);
                    normalizeDepNode = {...target,...fileInfo};
                }catch(e){
                    console.error(`Fail to resolve parh '${target.path}'`);
                }
            }
            this.dependenceNodes.push(normalizeDepNode);
        }else{
            // 如果是重复节点，
            if (this.dependenceNodes[idx].reference.findIndex(fnode => fnode.path === currentFileNode.path) === -1) {
                this.dependenceNodes[idx].reference.push(currentFileNode);
            }
        }
        this.collectDeps(currentFileNode,target);
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
        const result:FileNode[] = [];
        for(let i = 0; i < len; i++) {
            const currentNode = allFileNodes[i];
            if (!dependenceNodesPaths.includes(currentNode.path)){
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
    private getModuleName(filePath:string):string {
        const rootFileBasicNames = rootFileEnum;
        const baseName = path.basename(filePath);
        const splitPath = filePath.split(path.sep);
        if (rootFileBasicNames.includes(baseName)) {
            return splitPath[splitPath.length - 2];
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
    private getModuleId(filePath:string, name:string) {
        const extName = path.extname(name);
        if (extName.length) {
            const moudleName = name.replace(extName,'');
            const normalizePath = filePath.replace(name, '').split(path.sep).join('-');
            return normalizePath + moudleName;
        } else {
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
    async scan(effectFn?:(FileNode)=>Promise<string[]>, ctx?: any){
        try{
            const stack = new Stack();
            const files = await scanFolder(this.entry);
            if(files.length) {
                for(let i=0;i<files.length;i++){
                    const isFolder = files[i].isDirectory();
                    const name = files[i].name;
                    const filePath = path.resolve(this.entry,files[i].name);
                    const moduleId = this.getModuleId(filePath,name);
                    const curNode:FileNode = {
                        name,isFolder,path:filePath,deps:[], moduleId
                    };
                    stack.push(curNode);
                    this.fileNodes.push(curNode);
                }
            }
            while(stack.length){
                const currentFileNode = stack.pop() as FileNode;
                if(currentFileNode.isFolder) {
                    const files = await scanFolder(currentFileNode.path);
                    if(files.length) {
                        for(let i=0;i<files.length;i++){
                            const isFolder = files[i].isDirectory();
                            const filePath = path.resolve(currentFileNode.path,files[i].name);
                            const name = this.getModuleName(filePath);
                            const basicInfo = await readFileBasicInfo(filePath);
                            const moduleId = this.getModuleId(filePath, name);
                            const curNode:FileNode = {
                                name,
                                isFolder,
                                path:filePath,
                                deps:[],
                                fileSize:basicInfo.size,
                                utime:basicInfo.mtime,
                                ctime:basicInfo.ctime,
                                moduleId,
                            };
                            stack.push(curNode);
                            this.fileNodes.push(curNode);
                        }
                    }
                }else{
                    // 传给外部parser解析出import的内容，获取到一组有import路径组成的数组
                    let dependenceFilePaths:string[] =  [];
                    if (effectFn) {
                        const cb = effectFn.bind(ctx);
                            dependenceFilePaths = await cb(currentFileNode);
                    }
                    // 解析这组数组每一个路径，查看是否真的有index文件，然后构造成fileNode存起来
                    const dependenceFilePathsNums:number = dependenceFilePaths.length;
                    for(let i=0;i<dependenceFilePathsNums;i++) {
                        const curPath = dependenceFilePaths[i];
                        const pathExtname = path.extname(curPath);
                        let depNode:DependenceNode|null = null;
                        // 只要后缀名不为空，那就是一个包含文件名的绝对路径
                        if (pathExtname!== ''){
                            const fileName = this.getModuleName(curPath);
                            const moduleId = this.getModuleId(curPath,fileName);
                            depNode = {
                                name:fileName,
                                path:curPath,
                                reference:[currentFileNode],
                                canResolve:true,
                                moduleId,
                            };
                        } else {
                            // 如果没有后缀名，则为类似"../../sl"的引用，尝试拼接后缀名再校验
                            const extNames = [...rootFileEnum,...enablePraseType];
                            let hasDone = false;
                            try{
                                // 先尝试拼接为目录后接index
                                for( let e = 0; e < extNames.length; e++) {
                                   const extName = extNames[e];
                                   let fullPath = '';
                                   if (enablePraseType.includes(extName)) {
                                       fullPath = curPath + extName;
                                   } else {
                                       fullPath = path.join(curPath, extName);
                                    }
                                    const isExist = await checkFileIsBuilt(fullPath);
                                    if (isExist) {
                                     const fileName = this.getModuleName(fullPath);
                                     const moduleId = this.getModuleId(fullPath, fileName);
                                     depNode = {
                                         name:fileName,
                                         path:fullPath,
                                         reference:[currentFileNode],
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
                                    depNode =  {
                                        name:fileName,
                                        path:curPath,
                                        reference:[currentFileNode],
                                        canResolve:false,
                                        moduleId
                                    };
                                    
                                }

                            }catch(e){
                                console.error(e);
                            }
                        }
                        if (depNode !== null){
                            // 记录到被依赖节点中
                           await this.markDependenceNode(depNode, currentFileNode);
                        }
                    }
                }
            }
        }catch(e){
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
    collectDeps(currentFileNode:FileNode, depNode:DependenceNode):void{
        const depPaths = currentFileNode.deps.map((dep) => dep.path);
        const normalizeReference= depNode.reference.map((fNode) => {
            return {
                path: fNode.path,
                name: fNode.name
            };
        });
        const normalizeDepNode = {...depNode};
        normalizeDepNode.reference = normalizeReference as FileNode[];
        if (depPaths.includes(depNode.path) === false){
            currentFileNode.deps.push(normalizeDepNode);
        }
    }

    /**
     * 构建文件结构树
     */
    async buildFileTree() {
        const stack = new Stack();
        this.fileTree = {
            name: this.entry,
            path:this.entry,
            isFolder: true,
            children: [],
            moduleId:''
        };
        stack.push(this.fileTree);
        try{
            while(stack.length) {
                const curNode = stack.pop() as FileTree;
                if (curNode.isFolder) {
                    const files = await scanFolder(curNode.path);
                    if(files.length) {
                        for(let i=0;i<files.length;i++){
                            const isFolder = files[i].isDirectory();
                            const filePath = path.resolve(curNode.path,files[i].name);
                            const name = this.getModuleName(filePath);
                            const modulePath = path.resolve(curNode.path, name.replace(path.extname(name),''));
                            const moduleId = this.getModuleId(filePath,name);
                            const nodeContent:FileTree = {
                                name,
                                path: modulePath,
                                isFolder,
                                children:[],
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
        }catch(e) {
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
    async removeFileNode(path:string):Promise<boolean>{
        try {
           const res = await removeFile(path);
           if (res) {
               const newFileNodes:FileNode[] = [];
               // 清理fileNodes
               for(let i = 0; i< this.fileNodes.length; i++) {
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
        }catch(e) {
            console.error(e);
            return false;
        }
    }
}
declare module 'koa' {
    namespace Application {
    }
}

interface BasicNode {
    /** 文件名 */
    name: string;
    /** 文件路径 */
    path: string;
    /** 文件模块唯一id，组成方法是path用'-'连接，最终文件末尾去掉后缀 */
    moduleId: string;
}

interface FileStat {
    /** 文件大小 */
    fileSize?: number,
    /** 创建时间 */
    ctime?: Date,
    /** 更新时间 */
    utime?: Date,
}

type Ifile = BasicNode & FileStat

export interface Config {
    entry:string,
    port: number,
    alias?:{
        [key:string]:string
    }
}

export interface FileTree extends BasicNode {
    /** 是否目录 */
    isFolder:boolean,
    children: FileTree[],
    /** 文件大小 */
    fileSize?: number
}

export interface FileNode extends Ifile {
    /** 是否目录 */
    isFolder:boolean,
    /** 自身依赖节点路径 */
    deps:DependenceNode[]
}

export interface DependenceNode extends Ifile {
    /** 被引用的节点 */
    reference: FileNode[],
    /** 是否可解析 */
    canResolve: boolean
}

export interface Config {
    entry:string,
    port: number,
    packageJsonPath?:string
    dependency?:{[module:string]:string}
    alias?:{
        [key:string]:string
    }
}

export interface Scaner {
    entry:string
    fileNodes:FileNode[]
    fileTree:FileTree | null
    dependenceNodes:DependenceNode[]
    markDependenceNode(target:DependenceNode, currentFileNode:FileNode):Promise<void>
    diff():FileNode[]
    scan(effectFn?:(FileNode)=>Promise<string[]>, ctx?: any):Promise<void>
    collectDeps(currentFileNode:FileNode, depNode:DependenceNode):void
    buildFileTree():Promise<void>
    removeFileNode(path:string):Promise<boolean>
}
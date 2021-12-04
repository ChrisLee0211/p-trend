declare module 'koa' {
    namespace Application {
        interface DefaultState {
            scaner: boolean
        }
    }
}

export interface Config {
    entry:string,
    port: number,
    alias?:{
        [key:string]:string
    }
}

export interface FileTree {
    name:string,
    path:string,
    isFolder:boolean,
    children: FileTree[],
    fileSize?: number
}

export interface FileNode {
    name:string,
    path:string,
    isFolder:boolean,
    fileSize?: number,
    ctime?: Date,
    utime?: Date,
    /** 自身依赖节点路径 */
    deps:DependenceNode[]
}

export interface DependenceNode {
    name:string,
    path:string,
    size?: number,
    ctime?: Date,
    utime?: Date,
    /** 被引用的节点 */
    reference: FileNode[],
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
    getModuleName(filePath:string):string
    scan(effectFn?:(FileNode)=>Promise<string[]>, ctx?: any):Promise<void>
    collectDeps(currentFileNode:FileNode, depNode:DependenceNode):void
    buildFileTree():Promise<void>
    removeFileNode(path:string):Promise<boolean>
}
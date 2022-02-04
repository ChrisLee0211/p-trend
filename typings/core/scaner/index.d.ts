import { Config, DependenceNode, FileNode, FileTree, Scaner } from 'src/types/global';
import { PraserCtr } from '../praser';
/**
 * 模块扫描器
 */
export declare class ScanerCtr implements Scaner {
    entry: string;
    alias: Config['alias'];
    fileNodes: FileNode[];
    fileTree: FileTree | null;
    dependenceNodes: DependenceNode[];
    npmDepsMap: Record<string, {
        count: number;
        reference: string[];
    }>;
    private npmRegs;
    externals: string[];
    constructor(entry: string, alias?: {
        [key: string]: string;
    }, npmDeps?: string[], externals?: string[]);
    /**
     * 标记当前节点为依赖节点并生成对应文件信息,同时也将依赖节点的路径收集到当前扫描节点中
     * @param target 需要记录的目标节点
     * @param currentFileNode 当前扫描节点
     * @author chris lee
     * @Time 2021/07/20
     * @update 2021/07/25 增加对依赖节点的文件大小、修改时间等记录
     */
    markDependenceNode(target: DependenceNode, currentFileNode: FileNode): Promise<void>;
    /**
     * 比对依赖文件节点和扫描所得文件节点，分析出未被引用的文件
     * @returns {FileNode} 未被引用的节点
     * @author chris lee
     * @Time 2021/07/20
     */
    diff(): FileNode[];
    /**
     * 根据路径返回模块名称
     * @param path 路径
     * @returns {string}
     * @author chris lee
     * @Time 2021/08/17
     */
    private getModuleName;
    /**
     * 根据路径和名称组装fileNode唯一的moduleId用于比较
     * @param filePath 路径
     * @param name 文件名
     * @author chris lee
     * @Time 2021/12/10
     */
    private getModuleId;
    /**
     * 过滤出可解析依赖
     * @param depsPath 依赖路径数组
     * @param currentFileNode 当前正在分析的文件节点
     * @returns 不包含npm以及cdn等外部依赖的路径数组
     * @author chris lee
     * @Time 2021/12/11
     */
    private filterEnabledPath;
    /**
     * 收集并记录每个npm包的引用次数及引用路径
     * @param deps 当前文件内所有依赖名称
     * @param fileNode 当前正在分析的文件节点
     * @returns {stirng[]} 返回属于npm包的依赖
     * @author chris lee
     * @Time 2022/02/04
     */
    private collectNpmDeps;
    /**
     * 初始化npm包到map中，后续用于计数被引用的依赖
     * @param npmDeps npm包列表
     * @returns
     * @author chris lee
     * @Time 2022/01/30
     */
    private initNpmMaps;
    /**
     * 格式化各路径为绝对路径
     * @param depPaths 依赖路径数组
     * @param fileNode 本次解析的目标节点
     * @returns {array} 依赖路径数组
     * @author chris lee
     * @Time 2021/07/20
     */
    private normalizePaths;
    /**
     * 根据初始化的entry开始以深度遍历方式扫描文件
     * @param effectFn 扫描文件节点时执行副作用回调
     * @param ctx 副作用函数本身的上下文
     * @author chris lee
     * @Time 2021/07/20
     */
    scan(effectFn?: (FileNode: any) => Promise<string[]>, ctx?: PraserCtr): Promise<void>;
    /**
     * 将依赖路径收集到当前扫描的fileNode中
     * @param currentFileNode 进行依赖收集的file节点
     * @param depNode 从文件内容中解析出来的依赖节点
     * @returns {FileNode}
     */
    collectDeps(currentFileNode: FileNode, depNode: DependenceNode): void;
    /**
     * 构建文件结构树
     */
    buildFileTree(): Promise<void>;
    /**
     * 删除指定路径的文件（单个）
     * @param {string[]} paths
     * @returns {boolean}
     * @author chris lee
     * @Time 2021/11/02
     */
    removeFileNode(path: string): Promise<boolean>;
}

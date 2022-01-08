import { Config, FileNode, Praser } from "../../types/global";
/**
 * 依赖路径解析器
 */
export declare class PraserCtr implements Praser {
    alias: Config['alias'];
    npmDeps: string[];
    externals: string[];
    constructor(alias?: {
        [key: string]: string;
    }, npmDeps?: string[], externals?: string[]);
    /**
     * 根据对应的fileNode读取文件解析依赖
     * @param node 解析依赖路径的目标节点
     * @returns {array} 依赖路径数组
     * @author chris lee
     * @Time 2021/07/20
     */
    parseDependency(node: FileNode): Promise<string[]>;
    /**
     * 过滤出可解析依赖
     * @param depsPath 依赖路径数组
     * @returns 不包含npm以及cdn等外部依赖的路径数组
     * @author chris lee
     * @Time 2021/12/11
     */
    private filterEnabledPath;
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
     * 将目标代码转为ast后收集依赖
     * @param code 解析目标代码内容
     * @returns
     * @author chris lee
     * @Time 2021/07/20
     * @update 2022/01/08 全面替换为swc实现编译收集
     */
    collectImportNodes(code?: string): Promise<string[]>;
}

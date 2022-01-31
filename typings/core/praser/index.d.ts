import { FileNode, ParserPlugin, Praser } from "../../types/global";
/**
 * 依赖路径解析器
 */
export declare class PraserCtr implements Praser {
    plugins: ParserPlugin[];
    constructor();
    /**
     * 根据对应的fileNode读取文件解析依赖
     * @param node 解析依赖路径的目标节点
     * @returns {array} 依赖路径数组
     * @author chris lee
     * @Time 2021/07/20
     */
    parseDependency(node: FileNode): Promise<string[]>;
    registerPlugins(plugin: ParserPlugin): void;
}

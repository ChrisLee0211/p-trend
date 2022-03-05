import { readFileContent } from "../../utils/file";
import { FileNode, ParserPlugin, Praser } from "../../types/global";
/**
 * 依赖路径解析器
 */
export class PraserCtr implements Praser {
    plugins:ParserPlugin[] = []
    constructor() {
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
    async parseDependency(node:FileNode):Promise<string[]>{
        let result:string[] = [];
        const pathname = node.path;
        const len = this.plugins.length;
        if (len) {
            try{
                for(let i = 0; i< len;i++) {
                    const plugin = this.plugins[i];
                    let isMatch = false;
                    if (typeof(plugin.rule) === 'function') {
                        isMatch = plugin.rule(pathname);
                    } else {
                        isMatch = plugin.rule.test(pathname);
                    }
                    if (plugin.exclude){
                        let isExclude = false;
                        if (typeof(plugin.exclude) === 'function') {
                            isExclude = plugin.exclude(pathname);
                        } else {
                            isExclude = plugin.exclude.test(pathname);
                        }
                        if(isExclude) continue;
                    }
                    if (isMatch) {
                        const content = await readFileContent(pathname,{encoding:'utf8'}) as string;
                        result = await plugin.collector(content);
                        break;
                    }
                }
            }catch(e){
                console.error(`Fail to resolve ${pathname}! Need other plugin to parse file.`);
            }
        } else {
            return result;
        }
        return result;
    }

    registerPlugins(plugin:ParserPlugin):void {
        this.plugins.push(plugin);
    }
}
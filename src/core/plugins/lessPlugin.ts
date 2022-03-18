import { ParserPlugin } from "@/types/global";
import * as syntax from 'postcss-less';
import postcss, { ChildNode, Declaration } from "postcss";

function isDecl(node:ChildNode): node is Declaration {
    return node.type === 'decl';
}

const lessImportParser = (code:string):Promise<string[]> => {
    const result:string[] = [];
    return new Promise((rs,rj) => {
        try{
            // 使用postcss尝试解析less
            postcss().process(code, {syntax}).then((res) => {
            const nodes = res.root.nodes;
            for(let i=0,len=nodes.length;i<len;i++) {
                const curAstNode = nodes[i];
                if (curAstNode.type==='atrule') {
                    if(curAstNode.name === 'import') {
                        result.push(curAstNode.params);
                    }
                }
                if (curAstNode.type === 'rule') {
                    const ruleNodes = curAstNode.nodes;
                    for(let n=0,len=ruleNodes.length;n<len;n++) {
                        const cur = ruleNodes[n];
                        if(isDecl(cur)) {
                            const importPath = cur.value.match(/\(('|")(.+)('|")\)/);
                            if(importPath?.length && importPath[2]){
                                result.push(importPath[2]);
                            }
                        }
                    }
                }
            }
                rs(result);
            });
        }catch(e) {
            rj(new Error('Fail to parse less file'));
        }
    });
};

/**
 * 用于解析less类型文件的引用(包含url、@import)
 */
export const lessPlugin:ParserPlugin = {
    rule:/\.(less)$/,
    collector:async (code) => {
        if(!code) return [];
        const result:string[] = await lessImportParser(code);
        return result;
    }
};

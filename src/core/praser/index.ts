import { readFileContent } from "../../utils/file";
import {parse} from '@babel/parser';
import traverse from '@babel/traverse';
import * as path from 'path';
import { Config, FileNode, Praser } from "../../types/global";
import { enablePraseType, rootFileEnum } from "../constant";

function isAliasExist(alias:Config['alias']): alias is {[k:string]:string} {
        if(Object.keys(alias??{}).length) return true;
        return false;
}
/**
 * 依赖路径解析器
 */
export class PraserCtr implements Praser {
    alias:Config['alias'] = {}
    npmDeps:string[] = []
    externals:string[] = []
    constructor(alias?:{[key:string]:string}, npmDeps?:string[], externals?:string[]) {
        this.alias = alias ?? {};
        this.npmDeps = npmDeps ?? [];
        this.externals = externals ?? [];
        this.collectImportNodes.bind(this);
        this.parseDependency.bind(this);
        this.normalizePaths.bind(this);
        this.filterEnabledPath.bind(this);
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
        if(enablePraseType.includes(path.extname(pathname)) === false) return result;
        try{
            const content = await readFileContent(pathname,{encoding:'utf8'}) as string;
            const depPaths = await this.collectImportNodes(content);
            
            const depPathsWithoutNpmDeps = this.filterEnabledPath(depPaths);
            result = this.normalizePaths(depPathsWithoutNpmDeps, node);
        }catch(e){
            console.error(e);
        }
        return result;
    }

    /**
     * 过滤出可解析依赖
     * @param depsPath 依赖路径数组
     * @returns 不包含npm以及cdn等外部依赖的路径数组
     * @author chris lee
     * @Time 2021/12/11
     */
    private filterEnabledPath(depsPath: string[]): string[] {
        return depsPath.filter((depPath) => {
            const pathSplit = depPath.split(path.sep);
            const root = pathSplit[0];
            return !this.npmDeps.includes(root) && !this.externals.includes(root);
        });
    }

    /**
     * 格式化各路径为绝对路径
     * @param depPaths 依赖路径数组
     * @param fileNode 本次解析的目标节点
     * @returns {array} 依赖路径数组
     * @author chris lee
     * @Time 2021/07/20
     */
    private normalizePaths(depPaths:string[], fileNode:FileNode):string[] {
        const result:string[] = [];
        if (!depPaths.length) return result;
        const aliasKey = Object.keys(this.alias || {});
        // todo: 根据目前文件路径和相对路径拼接出绝对路径
        for(let i = 0; i<depPaths.length;i++) {
            const dependencePath = depPaths[i];
            const splitPath = dependencePath.split(path.sep);
            // 先判断有没有路径别名
            if (aliasKey.length) {
                let isResolve = false;
                for (let a=0;a<aliasKey.length;a++) {
                    if (splitPath.includes(aliasKey[a])) {
                        const replaceSplitPath = splitPath.map((p) => {
                            if (p === aliasKey[a]  && isAliasExist(this.alias)) return this.alias[aliasKey[a]];
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
             if(rootFileEnum.includes(path.basename(fileNode.path))) {
                const baseName = path.basename(fileNode.path);
                filefolderPath =fileNode.path.split(baseName)[0];
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
     * 利用babel praser将目标代码转为ast后收集依赖
     * @param code 解析目标代码内容
     * @returns 
     * @author chris lee
     * @Time 2021/07/20
     */
    async collectImportNodes(code?:string):Promise<string[]> {
        if(!code) return [];
        const result:string[] = [];
            const ast = parse(code,{plugins:['typescript','jsx',],sourceType:'module'});
        traverse(ast, {
            ImportDeclaration(visitPath){
                const node = visitPath.node;
                const sourcePath = node.source.value;
                result.push(sourcePath??'');
            },
            ExpressionStatement(visitPath) {
                const node = visitPath.node;
                if (node.expression?.type === 'CallExpression') {
                    const {callee} = node.expression;
                    if (callee.type === "MemberExpression") {
                        const object = callee.object;
                        if (object.type === 'CallExpression') {
                            const finalCallee = object.callee;
                            if (finalCallee.type === 'Import' && object.arguments[0].type==='StringLiteral') {
                                const sourcePath = object.arguments[0].value;
                                result.push(sourcePath);
                            }
                        }
                    }
                    if (callee.type === 'Identifier' && callee.name === 'require') {
                        const arg = node.expression.arguments[0];
                        if (arg.type === 'StringLiteral') {
                            const sourcePath = arg.value;
                            result.push(sourcePath);
                        }
                        
                    }
                }
            },
            VariableDeclaration(visitPath) {
                const node = visitPath.node;
                if (node.declarations.length){
                    for( let i = 0; i < node.declarations.length; i++) {
                        const cur = node.declarations[i];
                        if(cur.init && cur.init.type === 'CallExpression') {
                            const initCallee = cur.init.callee;
                            if (initCallee.type === 'Identifier' && initCallee.name === 'require') {
                                const initArgs = cur.init.arguments;
                                if (initArgs.length && initArgs[0].type === 'StringLiteral') {
                                    result.push(initArgs[0].value);
                                }
                            }
                        }
                    }
                }
            }
        });
        return result;
    }
}
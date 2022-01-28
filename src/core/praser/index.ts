/* eslint-disable no-debugger */
import { readFileContent } from "../../utils/file";
import { transform } from '@swc/core';
import * as path from 'path';
import { Config, FileNode, Praser } from "../../types/global";
import { enablePraseType, rootFileEnum } from "../constant";
import { SWCVisitor } from './swcParser';

/**
 * 依赖路径解析器
 */
export class PraserCtr implements Praser {

    constructor() {
        this.collectImportNodes.bind(this);
        this.parseDependency.bind(this);
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
            result = depPaths;
        }catch(e){
            console.error(e);
        }
        return result;
    }

    /**
     * 将目标代码转为ast后收集依赖
     * @param code 解析目标代码内容
     * @returns 
     * @author chris lee
     * @Time 2021/07/20
     * @update 2022/01/08 全面替换为swc实现编译收集
     */
    async collectImportNodes(code?:string):Promise<string[]> {
        if(!code) return [];
        const result:string[] = [];
        const collectPath = (path:string) => {
            result.push(path);
        };
        const prasePlugin = new SWCVisitor(collectPath);
        await transform(code, {
            plugin: (m) => prasePlugin.visitProgram(m),
            jsc:{
                parser: {
                    syntax: 'typescript',
                    tsx: true,
                },
            }
        });
        return result;
    }
}
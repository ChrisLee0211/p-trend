/**
 * 试验性尝试swc代替babel作为代码解析器，
 * 对于parser主体api不做任何更改，保证和collectImportNodes 方法一样的类型和输入输出作为替换方案
 */
import { Module,Argument } from "@swc/core/types";
import { Visitor } from "@swc/core/Visitor.js";
import { transform } from '@swc/core';
 
type CollectFnType = (path:string) => void

 export class SWCVisitor extends Visitor {
    collectFn?:CollectFnType;
    constructor(cb?:CollectFnType) {
        super();
        if (cb) {
            this.collectFn = cb;
        }
        this.getFirstArgsValue = this.getFirstArgsValue.bind(this);
    }
    getFirstArgsValue(args?:Array<Argument>):string {
        let path = '';
        if (args && args.length) {
            const firstArg = args[0];
            if (firstArg.expression.type === 'StringLiteral') {
                 path = firstArg.expression.value;
            }
        }
        return path;
    }
     visitModule(m: Module): Module {
         const importContent = m.body;
         if(importContent.length) {
             let path = '';
             const importNode = importContent[0];
             if (importNode.type === 'ImportDeclaration') {
                 const source = importNode.source;
                   path = source.value;
             }
             if (importNode.type === 'VariableDeclaration') {
                 const declareSouce = importNode.declarations;
                 if (declareSouce.length) {
                     const target = declareSouce[0];
                     if (target.type === 'VariableDeclarator' && target.init?.type === 'CallExpression') {
                         const args = target.init.arguments;
                         path = this.getFirstArgsValue(args);
                     }
                 }
             }
             if(importNode.type === 'ExpressionStatement') {
                 const expression = importNode.expression;
                 if (expression.type ==='CallExpression') {
                     const args = expression.arguments;
                     path = this.getFirstArgsValue(args);
                 }
             }
             if(this.collectFn && path.length > 0) {
                this.collectFn(path);
            }
         }
         return m;
     }
 }

 /**
  * 利用swc换转代码期间借用visitor实例访问ast获取模块路径
  * @param code 
  * @returns 
  * @author chris lee
  * @Time 2022/01/06
  */
export const collectImportNodes = async (code?:string):Promise<string[]> => {
    if(!code) return [];
    const result:string[] = [];
    const collectPath = (path:string) => {
        result.push(path);
    };
    const prasePlugin = new SWCVisitor(collectPath);
    const output = await transform(code, {
        plugin: (m) => prasePlugin.visitProgram(m),
        jsc:{
            parser: {
                syntax: 'typescript',
            }
        }
    });
    return result;
};
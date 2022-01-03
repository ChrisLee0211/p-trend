/**
 * 试验性尝试swc代替babel作为代码解析器，
 * 对于parser主体api不做任何更改，保证和collectImportNodes 方法一样的类型和输入输出作为替换方案
 */
import { Module } from "@swc/core/types";
import { Visitor } from "@swc/core/Visitor.js";

type CollectFnType = (path:string) => void

 export class SWCVisitor extends Visitor {
    collectFn?:CollectFnType;
    constructor(cb?:CollectFnType) {
        super();
        if (cb) {
            this.collectFn = cb;
        }
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
                         if (args.length) {
                             const firstArg = args[0];
                             if (firstArg.expression.type === 'StringLiteral') {
                                  path = firstArg.expression.value;
                             }
                         }
                     }
                 }
             }
             if(this.collectFn && path.length > 0) {
                this.collectFn(path);
            }
         }
         return m;
     }
 }
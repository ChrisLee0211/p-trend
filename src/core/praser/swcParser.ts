/**
 * 试验性尝试swc代替babel作为代码解析器，
 */
import { Module,Argument, ModuleItem } from "@swc/core/types";
import { Visitor } from "@swc/core/Visitor";
import { transform } from "@swc/core";
 
type CollectFnType = (path:string) => void

 export class SWCVisitor extends Visitor {
    collectFn?:CollectFnType;
    constructor(cb?:CollectFnType) {
        super();
        if (cb) {
            this.collectFn = cb;
        }
        this.getFirstArgsValue = this.getFirstArgsValue.bind(this);
        this.collectModulePath = this.collectModulePath.bind(this);
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
    collectModulePath(moduleItem: ModuleItem):void {
        let path = '';
             const importNode = moduleItem;
             if (importNode.type === 'ImportDeclaration') {
                 const source = importNode.source;
                   path = source.value;
             }
             if (importNode.type === 'VariableDeclaration') {
                 const declareSouce = importNode.declarations;
                 if (declareSouce.length) {
                     const target = declareSouce[0];
                     if (target.type === 'VariableDeclarator' && target.init?.type === 'CallExpression') {
                        if (target.init.callee.type === 'Identifier' && target.init.callee.value === 'require') {
                            const args = target.init.arguments;
                             path = this.getFirstArgsValue(args);
                        }
                     }
                 }
             }
             if(importNode.type === 'ExpressionStatement') {
                 const expression = importNode.expression;
                 if (expression.type ==='CallExpression' && expression.callee.type === 'Identifier' && expression.callee.value === 'require') {
                     const args = expression.arguments;
                     path = this.getFirstArgsValue(args);
                 }
             }
             if(this.collectFn && path.length > 0) {
                this.collectFn(path);
            }
    }
    // visitCallExpression(fn:CallExpression): Expression {
    //     if(fn.callee.type === 'Identifier') {
    //         const fnName = fn.callee.value;
    //         if(fnName === 't') {
    //             const param = fn.arguments[0];
    //             // 是普通字符串
    //             if(param.expression.type === 'StringLiteral') {
    //                 const key = param.expression.value;
    //             }
    //             // 可能是外部import的常量或变量
    //             if(param.expression.type === 'Identifier') {
    //                 const keyVariableName = param.expression.value;
    //             }
    //         }
    //     }
    //     return fn;
    // }
    visitModule(m: Module): Module {
         const importContents = m.body;
         if(importContents.length) {
             const modulesQuantity = importContents.length;
            for(let i=0;i<modulesQuantity; i++ ){
                this.collectModulePath(importContents[i]);
            }
         }
         return m;
     }
 }

 /**
  * 解析代码块并抽取出内部依赖
  * @param code 代码块
  * @returns 
  * @author chris lee
  * @Time 2022/01/29
  */
 export const scanImportDeclaration = async (code:string):Promise<string[]> => {
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
 };
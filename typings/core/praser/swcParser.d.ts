/**
 * 试验性尝试swc代替babel作为代码解析器，
 * 对于parser主体api不做任何更改，保证和collectImportNodes 方法一样的类型和输入输出作为替换方案
 */
import { Module, Argument } from "@swc/core/types";
import { Visitor } from "@swc/core/Visitor.js";
declare type CollectFnType = (path: string) => void;
export declare class SWCVisitor extends Visitor {
    collectFn?: CollectFnType;
    constructor(cb?: CollectFnType);
    getFirstArgsValue(args?: Array<Argument>): string;
    visitModule(m: Module): Module;
}
export {};

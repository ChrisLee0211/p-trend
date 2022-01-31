/**
 * 试验性尝试swc代替babel作为代码解析器，
 */
import { Module, Argument, ModuleItem } from "@swc/core/types";
import { Visitor } from "@swc/core/Visitor";
declare type CollectFnType = (path: string) => void;
export declare class SWCVisitor extends Visitor {
    collectFn?: CollectFnType;
    constructor(cb?: CollectFnType);
    getFirstArgsValue(args?: Array<Argument>): string;
    collectModulePath(moduleItem: ModuleItem): void;
    visitModule(m: Module): Module;
}
/**
 * 解析代码块并抽取出内部依赖
 * @param code 代码块
 * @returns
 * @author chris lee
 * @Time 2022/01/29
 */
export declare const scanImportDeclaration: (code: string) => Promise<string[]>;
export {};

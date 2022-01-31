import { ParserPlugin } from "@/types/global";
import { scanImportDeclaration } from "../praser/swcParser";

/**
 * 用于解析js、ts类型文件的引用（包含jsx和tsx）
 */
export const jsPlugin:ParserPlugin = {
    rule:/\.(js|jsx|ts|tsx)$/,
    collector:async (code) => {
        if(!code) return [];
        const result:string[] = await scanImportDeclaration(code);
        return result;
    }
};

import { ParserPlugin } from "@/types/global";
import * as less from 'less';

const lessImportParser = (code:string):Promise<string[]> => {
    const result:string[] = [];
    return new Promise((rs,rj) => {
        try{
            less.render(code,(err,output) => {
                if(output?.imports && output?.imports.length) {
                    result.push(...output.imports);
                }
                rs(result);
            });
        }catch(e) {
            rj(new Error('Fail to parse less file'));
        }
    });
};

/**
 * 用于解析js、ts类型文件的引用（包含jsx和tsx）
 */
export const lessPlugin:ParserPlugin = {
    rule:/\.(less)$/,
    collector:async (code) => {
        if(!code) return [];
        const result:string[] = await lessImportParser(code);
        return result;
    }
};

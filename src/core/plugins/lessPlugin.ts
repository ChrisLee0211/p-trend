import { ParserPlugin } from "@/types/global";

const lessImportParser = (code:string):Promise<string[]> => {
    const result:string[] = [];
    return new Promise((rs,rj) => {
        try{
            // 使用postcss尝试解析less
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

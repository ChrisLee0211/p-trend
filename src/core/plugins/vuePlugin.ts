import { ParserPlugin } from "@/types/global";
import { scanImportDeclaration } from "../praser/swcParser";
import {Parser} from 'htmlparser2';

/**
 * 用于vue单文件组件
 */
export const vuePlugin:ParserPlugin = {
    rule:/\.(vue)$/,
    collector:async (code) => {
        if(!code) return [];
        let result:string[] = [];
        let isScript = false;
        let scriptCode = '';
        const parser = new Parser({
            onopentag(name) {
                if (name === "script") {
                    isScript = true;
                }
            },
            ontext(text) {
                if (isScript) {
                    scriptCode = text;
                }
            },
            onclosetag(tagname) {
                if (tagname === "script") {
                    isScript = false;
                }
            },
        });
        if (scriptCode.trim().length) {
            result = await scanImportDeclaration(scriptCode);
        }
        parser.write(code);
        parser.end();
        return result;
    }
};

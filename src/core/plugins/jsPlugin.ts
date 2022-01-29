import { ParserPlugin } from "@/types/global";
import { transform } from "@swc/core";
import { SWCVisitor } from "../praser/swcParser";

export const jsPlugin:ParserPlugin = {
    rule:/\.(js|jsx|ts|tsx)$/,
    collector:async (code) => {
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
};

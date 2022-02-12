import * as Koa from 'koa';
import { Scaner } from 'src/types/global';

interface NpmListItem {
    count:number,
    reference:string[],
    name:string
}

const normalizeNpm = (npmMaps:Record<string,{count:number,reference:string[]}>):NpmListItem[] => {
    const result:NpmListItem[] = [];
    const npmNames = Object.keys(npmMaps);
    if(npmNames.length) {
        const len = npmNames.length;
        for(let i = 0; i< len; i++) {
            const key = npmNames[i];
            const npm = npmMaps[key];
            result.push({
                ...npm,
                name: key,
            });
        }
    }
    return result;
};

class PkgService {
    async getPackageList(ctx:Koa.Context,next:Koa.Next):Promise<void>{
        const scaner = ctx.state.scaner as Scaner;
        const entry = ctx.state.entry;
        const result = normalizeNpm(scaner.npmDepsMap);
        ctx.response.body = {
            deps:result,
            entry: entry
        };
        await next();
    }
}


export default new PkgService();
import * as Koa from 'koa';
import { Scaner } from 'src/types/global';

class GraphService {
    async getFileNodes(ctx:Koa.Context,next:Koa.Next):Promise<void>{
        const scaner = ctx.state.scaner as Scaner;
        const entry = ctx.state.entry;
        ctx.response.body = {
            nodes: scaner.fileNodes,
            tree: scaner.fileTree || null,
            deps: scaner.dependenceNodes || [],
            entry: entry
        };
        await next();
    }
}


export default new GraphService();
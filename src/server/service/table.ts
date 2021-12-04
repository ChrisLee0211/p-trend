import * as Koa from 'koa';
import { FileNode, Scaner } from 'src/types/global';
import { removeFile } from '../../utils/file';
interface SearchQuery {
    name?:string,
    ctime?: [number, number],
    utime?: [number, number],
}

const filterFileNodes = (nodes:FileNode[], page:number, pageSize:number, query?:SearchQuery) => {
    const result = {
        list: [] as FileNode[],
        total:0,
    };
    if (!nodes || !nodes.length) return result;
    let list:FileNode[] = [];
    if (!query) {
        list = nodes;
    } else {
        const hasName = Reflect.has(query,'name') && query.name!=='';
        const hasCtime = Reflect.has(query,'ctime');
        const hasUtime = Reflect.has(query,'utime');
        list = nodes;
        try {
            if (hasName) {
                list = list.filter((node) => {
                    const reg = new RegExp(query.name as string);
                    return reg.test(node.name) || reg.test(node.path);
                });
            }
            if (hasCtime) {
                list = list.filter((node) => {
                    const timestamp = Number(node.ctime);
                    const ctime = query.ctime as [number, number];
                    return ctime[0] < timestamp && ctime[1] >= timestamp;
                });
            }
            if (hasUtime) {
                list = list.filter((node) => {
                    const timestamp = Number(node.utime);
                    const utime = query.utime as [number, number];
                    return utime[0] < timestamp && utime[1] >= timestamp;
                });
            }
        }catch(e) {
            console.error(e);
        }
        result.total = list.length;
        if (list.length <= pageSize) {
            result.list = list;
        }else {
            result.list = list.slice((page - 1)*pageSize, page * pageSize);
        }
    }
    return result;
};

class TableService {

    async getTableData(ctx:Koa.Context,next:Koa.Next):Promise<void>{
        const scaner = ctx.state.scaner as Scaner;
        const query = ctx.query;
        const page = Number(query?.page??1);
        const name = query?.name as string | undefined;
        const ctimeStart = query?.ctimeStart;
        const ctimeEnd = query?.ctimeEnd;
        const utimeStart = query?.utimeStart;
        const utimeEnd = query?.utimeEnd;
        const pageSize = Number(query?.PageSize??10);
        const searchParam:SearchQuery = {};
        if (name && name!=='') {
            searchParam['name'] = name;
        }
        if (ctimeStart && ctimeEnd) {
            searchParam['ctime'] = [Number(ctimeStart),Number(ctimeEnd)];
        }
        if (utimeStart && utimeEnd) {
            searchParam['ctime'] = [Number(utimeStart),Number(utimeEnd)];
        }
        const fileNodes = scaner.fileNodes;
        const result = filterFileNodes(fileNodes,page,pageSize,searchParam);
        ctx.response.body = {
            data: result.list,
            page,
            pageSize,
            total:result.total,
        };
        await next();
    }

    async removeFile(ctx:Koa.Context,next:Koa.Next):Promise<void>{
       let result = false;
       const targetPath = ctx.request.body.path;
       try{
           // todo：不能这样删除，应该在scan模块里删除，因为删了文件，还必须把构造过的fileTree、fileNode删掉
           // 不然再请求一样会在内存中返回已删除的节点
           const scaner = ctx.state.scaner as Scaner;
           result = await scaner.removeFileNode(targetPath);
       }catch(e) {
        console.error(e);
       }
       ctx.response.body = {
           result,
       };
       await next();
    }
}


export default new TableService();
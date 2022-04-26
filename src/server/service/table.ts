import * as Koa from 'koa';
import { FileNode, Scaner } from 'src/types/global';

const sortyFileNodes = (nodes: FileNode[], sortBy: Array<SortType>): FileNode[] => {
    let list = nodes;
    const sortTypes = sortBy;
    while (sortTypes.length) {
        const currentSortType = sortTypes.pop();
        switch (currentSortType) {
            case "ctime_asce":
                list = list.sort((a,b) => Number(a.ctime) - Number(b.ctime));
                break;
            case "ctime_desce":
                list = list.sort((a,b) => Number(b.ctime) - Number(a.ctime));
                break;
            case "deps_asce":
                list = list.sort((a,b) => a.deps.length - b.deps.length);
                break;
            case "deps_desce":
                list = list.sort((a,b) => b.deps.length - a.deps.length);
                break;
            case "size_asce":
                list = list.sort((a,b) => Number(a.fileSize) - Number(b.fileSize));
                break;
            case "size_desce":
                list = list.sort((a,b) => Number(b.fileSize) - Number(a.fileSize));
                break;
            case "utime_asce":
                list = list.sort((a,b) => Number(a.utime) - Number(b.utime));
                break;
            case "utime_desce":
                list = list.sort((a,b) => Number(b.utime) - Number(a.utime));
                break;
            default:

        }
    }
    return list;
};

type SortType = 'deps_asce' | 'deps_desce' | 'size_asce' | 'size_desce' | 'ctime_asce' | 'ctime_desce' | 'utime_asce' | 'utime_desce'
interface SearchQuery {
    name?: string,
    ctime?: [number, number],
    utime?: [number, number],
    sortBy?: Array<SortType>
}

const filterFileNodes = (nodes: FileNode[], page: number, pageSize: number, query?: SearchQuery) => {
    const result = {
        list: [] as FileNode[],
        total: 0,
    };
    if (!nodes || !nodes.length) return result;
    let list: FileNode[] = [];
    if (!query) {
        list = nodes;
    } else {
        const hasName = Reflect.has(query, 'name') && query.name !== '';
        const hasCtime = Reflect.has(query, 'ctime');
        const hasUtime = Reflect.has(query, 'utime');
        const hasSort = Reflect.has(query, 'sortBy');
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
            if (hasSort) {
                const sortTypes = query.sortBy || [];
                list = sortyFileNodes(list,sortTypes);
            }
        } catch (e) {
            console.error(e);
        }
        result.total = list.length;
        if (list.length <= pageSize) {
            result.list = list;
        } else {
            result.list = list.slice((page - 1) * pageSize, page * pageSize);
        }
    }
    return result;
};

class TableService {

    async getTableData(ctx: Koa.Context, next: Koa.Next): Promise<void> {
        const scaner = ctx.state.scaner as Scaner;
        const query = ctx.query;
        const page = Number(query?.page ?? 1);
        const name = query?.name as string | undefined;
        const ctimeStart = query?.ctimeStart;
        const ctimeEnd = query?.ctimeEnd;
        const utimeStart = query?.utimeStart;
        const utimeEnd = query?.utimeEnd;
        const pageSize = Number(query?.PageSize ?? 10);
        const searchParam: SearchQuery = {};
        if (name && name !== '') {
            searchParam['name'] = name;
        }
        if (ctimeStart && ctimeEnd) {
            searchParam['ctime'] = [Number(ctimeStart), Number(ctimeEnd)];
        }
        if (utimeStart && utimeEnd) {
            searchParam['ctime'] = [Number(utimeStart), Number(utimeEnd)];
        }
        const fileNodes = scaner.fileNodes;
        const result = filterFileNodes(fileNodes, page, pageSize, searchParam);
        ctx.response.body = {
            data: result.list,
            page,
            pageSize,
            total: result.total,
        };
        await next();
    }

    async removeFile(ctx: Koa.Context, next: Koa.Next): Promise<void> {
        let result = false;
        const targetPath = ctx.request.body.path;
        try {
            // 需要在扫瞄器实例内删除，不然再请求一样会在内存中返回已删除的节点
            const scaner = ctx.state.scaner as Scaner;
            result = await scaner.removeFileNode(targetPath);
        } catch (e) {
            console.error(e);
        }
        ctx.response.body = {
            result,
        };
        await next();
    }
}


export default new TableService();
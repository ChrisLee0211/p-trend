import * as Koa from 'koa';
import { FileNode, Scaner } from 'src/types/global';

const sortyFileNodes = (nodes: FileNode[], sortBy: Array<SortType>): FileNode[] => {
    let list = nodes;
    const sortTypes = sortBy;
    while (sortTypes.length) {
        const currentSortType = sortTypes.shift();
        switch (currentSortType) {
            case "ctime_ascend":
                list = list.sort((a,b) => Number(a.ctime) - Number(b.ctime));
                break;
            case "ctime_descend":
                list = list.sort((a,b) => Number(b.ctime) - Number(a.ctime));
                break;
            case "deps_ascend":
                list = list.sort((a,b) => a.deps.length - b.deps.length);
                break;
            case "deps_descend":
                list = list.sort((a,b) => b.deps.length - a.deps.length);
                break;
            case "fileSize_ascend":
                list = list.sort((a,b) => Number(a?.fileSize??0) - Number(b?.fileSize??0));
                break;
            case "fileSize_descend":
                list = list.sort((a,b) => Number(b?.fileSize??0) - Number(a?.fileSize??0));
                break;
            case "utime_ascend":
                list = list.sort((a,b) => Number(a.utime) - Number(b.utime));
                break;
            case "utime_descend":
                list = list.sort((a,b) => Number(b.utime) - Number(a.utime));
                break;
            default:

        }
    }
    return list;
};

type SortType = 'deps_ascend' | 'deps_descend' | 'fileSize_ascend' | 'fileSize_descend' | 'ctime_ascend' | 'ctime_descend' | 'utime_ascend' | 'utime_descend'
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
        const sortBy = query?.sortBy;
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
        if (sortBy) {
            searchParam['sortBy'] = (sortBy as string).split(',') as unknown as SortType[];
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
            // ????????????????????????????????????????????????????????????????????????????????????????????????
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
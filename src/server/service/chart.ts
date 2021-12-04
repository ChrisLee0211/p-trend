import * as Koa from 'koa';
import { DependenceNode, FileNode, FileTree, Scaner } from 'src/types/global';
import { Stack } from '../../utils/stack';
import * as path from 'path';

function getFileTreeSizeList(tree: FileTree | null):FileSizeChartItem[] {
    const result:FileSizeChartItem[] = [];
    if (!tree) return result;
    const stack = new Stack();
    stack.push(tree);
    while(stack.length) {
        const curNode = stack.pop() as FileTree;
        if (curNode.isFolder) {
            if (curNode.fileSize) {
                const data = {fileName: curNode.name, filePath: curNode.path, fileSize:curNode.fileSize};
                result.push(data);
            }
            if (curNode.children.length) {
                for( let i = 0; i< curNode.children.length; i++) {
                    const child = curNode.children[i];
                    stack.push(child);
                }
            }
        }
    }
    return result;
}


function getFileNodeSizeList(nodes:FileNode[]):FileSizeChartItem[] {
    const result:FileSizeChartItem[] = [];
    try{
        for( let i = 0; i<nodes.length;i++) {
            const curNode = nodes[i];
            if (curNode.fileSize) {
                const data = {
                    fileName: curNode.name,
                    filePath: curNode.path,
                    fileSize: curNode.fileSize
                };
                result.push(data);
            }
        }
    }catch(e) {
        console.error(e);
    }
    return result;
}

function getFileTypeList(tree):FileTypeChartItem[] {
    const fileTypeMap = new Map<string, {num:number, list:{fileName:string, filePath:string}[]}>();
    const stack = new Stack();
    stack.push(tree);
    try{
        while(stack.length) {
            const curNode = stack.pop() as FileTree;
            if(curNode.isFolder) {
                if (curNode.children.length) {
                    for( let i = 0; i< curNode.children.length; i++) {
                        const child = curNode.children[i];
                        stack.push(child);
                    }
                }
            } else {
                const filePath = curNode.path;
                const normalizeExtname = path.extname(filePath);
                const extname = normalizeExtname.length ? normalizeExtname : path.basename(filePath);
                const baseInfo = {
                    fileName: curNode.name,
                    filePath: curNode.path,
                };
                if (fileTypeMap.has(extname)) {
                    const item = fileTypeMap.get(extname) as {num:number, list:{fileName:string, filePath:string}[]};
                    item.num = item?.num + 1;
                    item.list.push(baseInfo);
                    fileTypeMap.set(extname, item);
                }else {
                    fileTypeMap.set(extname,{num:1, list:[baseInfo]});
                }
            }
        }
    }catch(e){
        console.error(e);
    }
    const result:FileTypeChartItem[] = [];
    fileTypeMap.forEach((val,key) => {
        result.push({
            fileType: key,
            num:val.num,
            list:val.list,
        });
    });
    return result;
}

interface FileTypeChartItem {
    fileType: string,
    num: number,
    list: {
        fileName: string,
        filePath: string,
    }[]
}

interface FileSizeChartItem {
    fileName: string,
    filePath: string,
    fileSize: number
}

class ChartService {
    async getFileNodeSizeChart(ctx:Koa.Context,next:Koa.Next):Promise<void> {
        const query = ctx.query;
        const limit = Number(query?.limit??10);
        const scaner = ctx.state.scaner as Scaner;
        const fileTree = scaner.fileTree;
        const fileNodes = scaner.fileNodes;
        const fileTreeSizeChart = getFileTreeSizeList(fileTree);
        const fileNodesSizeChart = getFileNodeSizeList(fileNodes);
        ctx.response.body = {
            tree: fileTreeSizeChart.slice(0,limit),
            nodes: fileNodesSizeChart.slice(0,limit),
            limit,
        };
        await next();
    }

    async getDependenceChart(ctx:Koa.Context,next:Koa.Next):Promise<void> {
        const query = ctx.query;
        const limit = Number(query?.limit??10);
        const scaner = ctx.state.scaner as Scaner;
        const fileNodes = scaner.fileNodes.map((curNode) => ({
            fileName: curNode.name,
            filePath: curNode.path,
            deps: curNode.deps
        }));
        ctx.response.body = {
            nodes: fileNodes.slice(0,limit),
            limit
        };
        await next();
    }

    async getReferenceChart(ctx:Koa.Context,next:Koa.Next):Promise<void> {
        const query = ctx.query;
        const limit = Number(query?.limit??10);
        const scaner = ctx.state.scaner as Scaner;
        const fileNodes = scaner.dependenceNodes.map((curNode) => ({
            fileName: curNode.name,
            filePath: curNode.path,
            reference: curNode.reference.length
        }));
        ctx.response.body = {
            nodes: fileNodes.slice(0,limit),
            limit
        };
        await next();
    }

    async getTypeChart(ctx:Koa.Context,next:Koa.Next):Promise<void> {
        const scaner = ctx.state.scaner as Scaner;
        const fileTree = scaner.fileTree;
        const fileTypeChartData = getFileTypeList({...fileTree});
        ctx.response.body = {
            types: fileTypeChartData
        };
        await next();
    }
}


export default new ChartService();
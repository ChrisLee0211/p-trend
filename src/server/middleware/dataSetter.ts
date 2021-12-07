import { ScanerCtr } from '@/core/scaner';
import * as path from 'path';
import * as Koa from 'koa';
import { scanFolder } from '../../utils/file';

export const dataSetter = (scaner: ScanerCtr, entry: string, port: number) => {
    return async (ctx:Koa.Context,next:Koa.Next):Promise<void> => {
        const mainfest = {
            index:'',
            vendor:'',
            css:''
        };
        const clientDistPath = path.join(__dirname, '../../../client/dist/assets/');
        try {
            const files = await scanFolder(clientDistPath);
            const len = files.length;
            for(let i = 0; i<len; i++) {
                const fileName = files[i].name;
                if(path.extname(fileName) === '.js') {
                    if (fileName.split('.').includes('index')) {
                        mainfest.index = fileName;
                    } 
                    if (fileName.split('.').includes('vendor')) {
                        mainfest.vendor = fileName;
                    }
                }
                if(path.extname(fileName) === '.css') {
                    mainfest.css = fileName;
                }
            }
        }catch(e){
            console.error(e);
        }
        ctx.state.scaner = scaner;
        ctx.state.entry = entry;
        ctx.state.port = port;
        ctx.state.mainfest = mainfest;
        await next();
    };
};
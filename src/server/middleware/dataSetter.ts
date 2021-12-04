import { ScanerCtr } from '@/core/scaner';
import * as Koa from 'koa';

export const dataSetter = (scaner: ScanerCtr, entry: string, port: number) => {
    return async (ctx:Koa.Context,next:Koa.Next):Promise<void> => {
        ctx.state.scaner = scaner;
        ctx.state.entry = entry;
        ctx.state.port = port;
        await next();
    };
};
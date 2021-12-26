import { ScanerCtr } from '@/core/scaner';
import * as Koa from 'koa';
export declare const dataSetter: (scaner: ScanerCtr, entry: string, port: number) => (ctx: Koa.Context, next: Koa.Next) => Promise<void>;

import * as Koa from 'koa';
import { ScanerCtr } from '../core/scaner/index';
export declare class Server {
    app: Koa;
    scaner: ScanerCtr;
    entry: string;
    constructor(scaner: ScanerCtr, entry?: string, port?: number);
}

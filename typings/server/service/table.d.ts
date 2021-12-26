import * as Koa from 'koa';
declare class TableService {
    getTableData(ctx: Koa.Context, next: Koa.Next): Promise<void>;
    removeFile(ctx: Koa.Context, next: Koa.Next): Promise<void>;
}
declare const _default: TableService;
export default _default;

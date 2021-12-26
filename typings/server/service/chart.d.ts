import * as Koa from 'koa';
declare class ChartService {
    getFileNodeSizeChart(ctx: Koa.Context, next: Koa.Next): Promise<void>;
    getDependenceChart(ctx: Koa.Context, next: Koa.Next): Promise<void>;
    getReferenceChart(ctx: Koa.Context, next: Koa.Next): Promise<void>;
    getTypeChart(ctx: Koa.Context, next: Koa.Next): Promise<void>;
}
declare const _default: ChartService;
export default _default;

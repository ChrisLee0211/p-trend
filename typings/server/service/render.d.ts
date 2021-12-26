import * as Koa from 'koa';
declare class RenderService {
    renderHtml(ctx: Koa.Context, next: Koa.Next): Promise<void>;
}
declare const _default: RenderService;
export default _default;

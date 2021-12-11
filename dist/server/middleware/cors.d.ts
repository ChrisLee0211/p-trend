import * as Koa from 'koa';
declare const cors: (ctx: Koa.Context, next: Koa.Next) => Promise<void>;
export default cors;

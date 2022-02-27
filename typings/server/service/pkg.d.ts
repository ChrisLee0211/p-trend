import * as Koa from 'koa';
declare class PkgService {
    getPackageList(ctx: Koa.Context, next: Koa.Next): Promise<void>;
    readReferenceFile(ctx: Koa.Context, next: Koa.Next): Promise<void>;
}
declare const _default: PkgService;
export default _default;

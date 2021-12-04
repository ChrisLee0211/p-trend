import * as koa from 'koa';
import GraphRouter from './graph';
import ChartRouter from './chart';
import TableRouter from './table';
import PageRouter from './page';

const routerlist = [
    GraphRouter,
    ChartRouter,
    TableRouter,
    PageRouter
];

const routerMount = (app:koa) => {
    for(let i=0;i<routerlist.length;i++){
        const router = routerlist[i];
        app.use(router.routes()).use(router.allowedMethods());
    }
};

export default routerMount;
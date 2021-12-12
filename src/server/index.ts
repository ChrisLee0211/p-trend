import * as Koa from 'koa';

//中间件
import cors from './middleware/cors';
import * as bodyParser from 'koa-bodyparser';
import routerMount from './router';
import {dataSetter} from './middleware/dataSetter';
import { StaticMeddleware } from './middleware/static';
import {ScanerCtr} from '../core/scaner/index';

export class Server{

    app: Koa
    scaner:ScanerCtr
    entry:string
    constructor(scaner:ScanerCtr, entry = '' , port = 3005) {

        const app = new Koa();
        app.use(cors);
        app.use(bodyParser());
        app.use(StaticMeddleware());
        app.use(dataSetter(scaner,entry,port));
        routerMount(app);
        app.listen(port); 
        console.log(`listen in port: ${port}`);
        this.app = app;
        this.scaner = scaner;
        this.entry = entry;
    }
}
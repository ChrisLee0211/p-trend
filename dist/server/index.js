"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const Koa = require("koa");
//中间件
const cors_1 = require("./middleware/cors");
const bodyParser = require("koa-bodyparser");
const router_1 = require("./router");
const dataSetter_1 = require("./middleware/dataSetter");
const static_1 = require("./middleware/static");
class Server {
    constructor(scaner, entry = '', port = 3005) {
        const app = new Koa();
        app.use(cors_1.default);
        app.use(bodyParser());
        app.use(static_1.StaticMeddleware());
        app.use(dataSetter_1.dataSetter(scaner, entry, port));
        router_1.default(app);
        app.listen(port);
        console.log(`listen in port ${port}`);
        this.app = app;
        this.scaner = scaner;
        this.entry = entry;
    }
}
exports.Server = Server;
//# sourceMappingURL=index.js.map
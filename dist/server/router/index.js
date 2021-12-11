"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graph_1 = require("./graph");
const chart_1 = require("./chart");
const table_1 = require("./table");
const page_1 = require("./page");
const routerlist = [
    graph_1.default,
    chart_1.default,
    table_1.default,
    page_1.default
];
const routerMount = (app) => {
    for (let i = 0; i < routerlist.length; i++) {
        const router = routerlist[i];
        app.use(router.routes()).use(router.allowedMethods());
    }
};
exports.default = routerMount;
//# sourceMappingURL=index.js.map
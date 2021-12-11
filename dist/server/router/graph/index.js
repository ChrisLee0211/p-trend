"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graph_1 = require("../../service/graph");
const Router = require("koa-router");
const router = new Router();
router.get('/graph', graph_1.default.getFileNodes);
exports.default = router;
//# sourceMappingURL=index.js.map
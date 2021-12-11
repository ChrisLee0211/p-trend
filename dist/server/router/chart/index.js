"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chart_1 = require("../../service/chart");
const Router = require("koa-router");
const router = new Router();
router.get('/chart/size', chart_1.default.getFileNodeSizeChart);
router.get('/chart/deps', chart_1.default.getDependenceChart);
router.get('/chart/reference', chart_1.default.getReferenceChart);
router.get('/chart/types', chart_1.default.getTypeChart);
exports.default = router;
//# sourceMappingURL=index.js.map
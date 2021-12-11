"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const table_1 = require("../../service/table");
const Router = require("koa-router");
const router = new Router();
router.get('/table', table_1.default.getTableData);
router.post('/table/delete', table_1.default.removeFile);
exports.default = router;
//# sourceMappingURL=index.js.map
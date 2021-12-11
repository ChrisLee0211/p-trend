"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const render_1 = require("../../service/render");
const Router = require("koa-router");
const router = new Router();
router.get('/p-trend', render_1.default.renderHtml);
exports.default = router;
//# sourceMappingURL=index.js.map
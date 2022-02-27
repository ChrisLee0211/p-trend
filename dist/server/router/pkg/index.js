"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pkg_1 = require("../../service/pkg");
const Router = require("koa-router");
const router = new Router();
router.get('/pkg', pkg_1.default.getPackageList);
router.post('/pkg/readContent', pkg_1.default.readReferenceFile);
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testFunc = exports.GameRouter = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
exports.GameRouter = router;
router.get('/', (request, response, next) => {
    response.send('this is game');
});
const testFunc = () => { return 4; };
exports.testFunc = testFunc;

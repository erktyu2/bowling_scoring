"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const game_router_1 = require("./routers/game.router");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: `${__dirname}/../config/.env` });
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
app.get('/', (request, response, next) => {
    response.send('This is a bowling game API-Server');
});
app.use('/game', game_router_1.GameRouter);
app.listen(port, () => {
    console.log(`Server is running at localhost:${port}`);
});
// this is required for unit tests
exports.default = app;
// TODO update readme
//      unit test

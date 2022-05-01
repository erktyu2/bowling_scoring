"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRouter = void 0;
const express_1 = require("express");
const scoring_service_1 = require("../utils/scoring.service");
const router = (0, express_1.Router)();
exports.GameRouter = router;
router.post('/score', (request, response, next) => {
    const rolls = request.body.Rolls;
    if (!scoring_service_1.ScoringService.validateRolls(rolls)) {
        return response.status(400).json({ response: "Rolls are not valid." });
    }
    const game = scoring_service_1.ScoringService.calculateGame(rolls);
    if (game === null || game === void 0 ? void 0 : game.Invalid) {
        return response.status(400).json({ response: "The rolls are returning a invalid game." });
    }
    response.json(game);
});

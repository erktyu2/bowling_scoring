import {Request, Response, NextFunction, Router} from 'express';
import * as core from 'express-serve-static-core';
import {ScoringService} from '../utils/scoring.service';
import {Game} from '../models/game.model';

const router: core.Router = Router();


router.get('/', (request: Request, response: Response, next: NextFunction) => {
    response.send('this is game');
})

router.post('/score', (request: Request, response: Response, next: NextFunction) => {
    const rolls: number[] = request.body.Rolls;
    if (!ScoringService.validateRolls(rolls)){
        return response.status(400).json({response: "Frame values are not valid."});
    }

    const game: Game | null = ScoringService.calculateGame(rolls);

    if (game?.Invalid){
        return response.status(400).json({response: "The rolls are returning a invalid game."});
    }

    response.json(game);
})
export { router as GameRouter };

import {ScoringService} from '../../src/utils/scoring.service';
import {Game} from '../../src/models/game.model';

describe('Scoring Service - validateRolls()', ()=>{
    it('should validate valid number of rolls(double ending) to valid', function () {
        expect(ScoringService.validateRolls([0,1, 2,3, 4,5, 5,5, 6,4, 10, 10, 10, 10, 5, 4])).toBe(true);
    });

    it('should validate valid number of rolls(triple ending) to valid', function () {
        expect(ScoringService.validateRolls([0,1, 2,3, 4,5, 5,5, 6,4, 10, 10, 10, 10, 5, 5, 10])).toBe(true);
    });

    it('should accept incomplete game rolls', function () {
        expect(ScoringService.validateRolls([0,1, 2,3, 4,5, 5,5, 6 ])).toBe(true);
    });

    it('should validate invalid number of rolls to invalid', function () {
        expect(ScoringService.validateRolls([0,1, 2,3, 4,5, 5,5, 6,4, 10, 10, 10, 10, 5, 4, 10, 20])).toBe(false);
    });

    it('should validate invalid types to invalid', function () {
        // @ts-ignore
        expect(ScoringService.validateRolls(["0",{ test: 'lorem ipsum'}])).toBe(false);
    });
})

describe('Scoring Service - calculateGame()', ()=>{
    const validRollsDoubleEnded: number[] = [0,1, 2,3, 4,5, 5,5, 6,4, 10, 10, 10, 10, 5, 4];
    const validRollsTripleEnded: number[] = [0,1, 2,3, 4,5, 5,5, 6,4, 10, 10, 10, 10, 5, 5, 10];
    const validRollsIncompleteGame: number[] = [0,1, 2,3, 4,5, 5,5,];
    const returnedGameDoubleEnded: Game = ScoringService.calculateGame(validRollsDoubleEnded);
    const returnedGameTripleEnded: Game = ScoringService.calculateGame(validRollsTripleEnded);
    const returnedGameIncompleteGame: Game = ScoringService.calculateGame(validRollsIncompleteGame);

    it('should return valid game.', function () {
        expect(returnedGameDoubleEnded.Invalid).toBe(false);
        expect(returnedGameTripleEnded.Invalid).toBe(false);
        expect(returnedGameIncompleteGame.Invalid).toBe(false);
    });

    it('should return ended game.', function () {
        expect(returnedGameDoubleEnded.Ended).toBe(true);
        expect(returnedGameTripleEnded.Ended).toBe(true);
    });

    it('should return incomplete game.', function () {
        expect(returnedGameIncompleteGame.Ended).toBe(false);
    });

    it('should return incomplete game.', function () {
        expect(returnedGameIncompleteGame.Ended).toBe(false);
    });

    it('should return a game with score of 38 when sequences of strike, spare and a frame of 4 and 0 are applied.', function () {
        const roll: number[] = [10, 6,4, 4,0, ];
        const returnedGame: Game = ScoringService.calculateGame(roll);
        expect(returnedGame.Score).toBe(38);
    });

    it('should return a game with score of 60 when 3 strikes in a row and a frame of 0 and 0. ', function () {
        const roll: number[] = [10, 10, 10, 0,0 ];
        const returnedGame: Game = ScoringService.calculateGame(roll);
        expect(returnedGame.Score).toBe(60);
    });

})

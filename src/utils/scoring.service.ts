import {Frame} from '../models/frame.model';
import {Game} from '../models/game.model';

export class ScoringService {


    public static validateRolls(rolls: number[]): boolean {
        return rolls && rolls.find != null && rolls.find(KnockedDownPins => !this.isKnockedDownPinsValid(KnockedDownPins)) === undefined;
    }

    public static calculateGame(rolls: number[]): Game {
        const game: Game = {
            Frames: [{FrameNumber: 1, Score: 0, IsSpare: false, IsStrike: false, Rolls: []} as Frame],
            Score: 0,
            Ended: false,
            Invalid: false
        };


        for (const knockedPins of rolls) {
            this.updateGame(knockedPins, game);
            if (game.Invalid){
                break;
            } else if (game.Frames.length > 10) {
                game.Invalid = true;
                break;
            }
        }

        if (!game.Invalid) {
            this.calculateScores(game);
        }

        return game;
    }


    // ********** Private methods **********
    private static isKnockedDownPinsValid(knockedDownPins: number): boolean {
        return [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ].find(number => number === knockedDownPins) !== undefined
    }

    private static updateGame(knockedPins: number, game: Game): Game {
        let frame: Frame;
        const previousFrame: Frame = game.Frames[game.Frames.length - 1];
        const isLastFrame: boolean = game.Frames.length === 10;

        if ((previousFrame.Rolls.length === 2 || previousFrame.IsStrike) && !isLastFrame){
            frame = {
                FrameNumber: game.Frames.length + 1,
                Score: 0,
                IsSpare: false,
                IsStrike: false,
                Rolls: []
            }
            game.Frames.push(frame);
        } else {
            frame = previousFrame;
        }

        frame.Rolls.push(knockedPins);

        const totalKnockedPins: number = frame.Rolls.reduce(((previous, current) => current + previous), 0);

        frame.Score = totalKnockedPins;

        if ( this.isRecalculatedValuesInvalid(isLastFrame, totalKnockedPins, frame)) {
            game.Invalid = true;
        } else if (frame.Rolls.length === 3 || (isLastFrame && totalKnockedPins < 10 && frame.Rolls.length === 2)){
            game.Ended = true;
        } else if (totalKnockedPins === 10 && !isLastFrame){
            if (frame.Rolls.length === 1){
                frame.IsStrike = true;
            } else if (frame.Rolls.length === 2 && !isLastFrame){
                frame.IsSpare = true;
            }
        }

        return game;
    }

    private static calculateScores(game: Game): Game {
        game.Frames = game.Frames.reduce((frames, currentFrame, index) => {
            frames = [...frames, currentFrame]

            if (frames.length > 1 && frames.length < 10) {

                const previousFrame: Frame = frames[index - 1];
                if (previousFrame.IsSpare){
                    previousFrame.Score = currentFrame.Rolls[0] + 10;
                } else if((currentFrame.IsStrike && previousFrame.IsStrike) || (currentFrame.IsSpare && previousFrame.IsStrike) ) {
                    previousFrame.Score = 20;
                }

                if (frames.length > 2){
                    const twoPreviousFrame: Frame = frames[index - 2];
                    if (currentFrame.IsStrike && previousFrame.IsStrike && twoPreviousFrame.IsStrike){
                        twoPreviousFrame.Score = 30;
                    }
                }
            }

            return frames;
        }, [] as Frame[])

        game.Score = game.Frames.reduce(((total, frame) => total + frame.Score), 0)

        return game;
    }

    private static isRecalculatedValuesInvalid (isLastFrame: boolean, totalKnockedPins: number, frame: Frame): boolean {
        return (!isLastFrame && totalKnockedPins > 10) ||
            (isLastFrame && totalKnockedPins > 10 && frame.Rolls.length < 3) ||
            (isLastFrame && totalKnockedPins > 30 && frame.Rolls.length === 3) ||
            totalKnockedPins < 0 || !Number.isInteger(totalKnockedPins) ||
            (totalKnockedPins <= 11 && frame.Rolls.length > 2) || frame.Rolls.length > 3 ||
            (frame.Rolls.length > 2 && (frame.Rolls[0] + frame.Rolls[1]) < 10);
    }
}

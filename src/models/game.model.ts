import {Frame} from './frame.model';

export interface Game {
    Frames: Frame[];
    Score: number;
    Ended: boolean;
    Invalid: boolean;
}

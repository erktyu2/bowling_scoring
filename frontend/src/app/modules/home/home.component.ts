import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {Subscription} from 'rxjs';
import {Game} from '../../models/game.model';
import {Frame} from '../../../../../src/models/frame.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  readonly DEFAULT_GAME: Game = {
    Frames: [{FrameNumber: 1, Score: 0, IsSpare: false, IsStrike: false, Rolls: []} as Frame],
    Score: 0,
    Ended: false,
    Invalid: false
  }



  subscriptions$: { [key: string]: Subscription } = {};
  currentValidGame: Game = this.DEFAULT_GAME;

  currentValidRolls: number[] = [];

  highestAvailableButton: number = 10;
  rolls: number[] = []

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    Object.keys(this.subscriptions$).forEach((subscriptionKey: string) => {
      const subscription: Subscription = this.subscriptions$[subscriptionKey];
      subscription.unsubscribe();
    });
  }

  getNewStatus(): void {
    if (this.rolls.length > 0) {
      this.subscriptions$.getGame = this.apiService.post<Game>('game/score',{Rolls: this.rolls}).subscribe(returnedGame=>{

        this.currentValidGame = returnedGame;
        this.currentValidRolls = this.rolls;

        const lastFrame: Frame = returnedGame.Frames[returnedGame.Frames.length - 1];
        if (returnedGame.Frames.length === 10){
          const totalKnockedPins: number = lastFrame.Rolls.reduce(((previous, current) => current + previous), 0);
          if (lastFrame.Rolls.length === 3 || (totalKnockedPins < 10 && lastFrame.Rolls.length === 2)){
            this.highestAvailableButton = -1;
          } else if (lastFrame.Rolls.length === 1){
            this.highestAvailableButton = 10 - lastFrame.Rolls[0];
            this.highestAvailableButton = this.highestAvailableButton === 0 ? 10 : this.highestAvailableButton
          } else if (lastFrame.Rolls.length === 2){
            this.highestAvailableButton = 10;
          }

        }else {
          if (lastFrame.Rolls.length === 2 || lastFrame.IsStrike ){
            this.highestAvailableButton = 10;
          } else {
            this.highestAvailableButton = 10 - lastFrame.Rolls[0];
          }
        }
      })
    }
  }

  addNumberToRoll(nr: number): void {
    this.rolls = this.currentValidRolls;
    this.rolls.push(nr);
    this.getNewStatus();
  }

  range(i: number): any[] {
    return new Array(i);
  }

  reset(): void {
    this.currentValidGame = this.DEFAULT_GAME;
    this.rolls = [];
    this.currentValidRolls = [];
    this.highestAvailableButton = 10;
  }
}

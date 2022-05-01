// @ts-ignore
import request, {Response} from 'supertest';
import {Express} from 'express-serve-static-core';
import { httpServer, expressApp} from '../src/app'
import DoneCallback = jest.DoneCallback;
import {createHttpTerminator} from 'http-terminator';
import {HttpTerminator} from 'http-terminator/src/types';
import {Game} from '../src/models/game.model';

let express: Express;
let httpTerminator: HttpTerminator;

beforeAll(() => {
    express = expressApp;
    jest.setTimeout(10000);
    httpTerminator = createHttpTerminator({ server: httpServer })
})

afterAll((done: DoneCallback)=>{
    httpTerminator.terminate().then(()=>{ done(); })
})


describe('server test', ()=>{
    it('should check API-Server is up and responding', (done: DoneCallback) => {
        request(express)
            .get('/')
            .expect(200)
            .end((err, response: Response) => {
                if (err) return done(err);
                expect(response.text).toBe('This is a bowling game API-Server');
                done()
            })
    });
})

describe('GameRouter-routes', ()=>{
    const route: string = "/api/game"

    it('should check GameRouter up and responding', (done: DoneCallback) => {
        request(express)
            .post(route + '/score')
            .send({"Rolls": [10, 5,5 , 4, 0 ,  5, 4,   5, 5,   5, 5,   5, 4,   0, 0,   0, 0,   5, 5,5 ]})
            .expect(200)
            .end((err, response: Response) => {
                if (err) return done(err);
                const returnedGame: Game = response.body;
                expect(!returnedGame.Invalid && returnedGame.Ended).toBe(true);
                done()
            })
    });

    it('should return bad request when invalid rolls are applied (more then 10 frames)', (done: DoneCallback) => {
        request(express)
            .post(route + '/score')
            .send({"Rolls": [10, 5,5, 5,5, 5,5,  4,0,  5,4,  4,0,  5,4,  4,0,  5,4,  4,0,  5,4,  4,0,  5,4]})
            .expect(400)
            .end((err, response: Response) => {
                if (err) return done(err);
                expect(response.body.response).toBe('The rolls are returning a invalid game.');
                done()
            })
    });

    it('should return bad request when invalid rolls are applied (different types)', (done: DoneCallback) => {
        request(express)
            .post(route + '/score')
            .send({"Rolls": ["10", "5","5", "5","5", "5","5",  "4","0",  ]})
            .expect(400)
            .end((err, response: Response) => {
                if (err) return done(err);
                expect(response.body.response).toBe('Rolls are not valid.');
                done()
            })
    });
})

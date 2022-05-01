// @ts-ignore
import request, {Response} from 'supertest';
import {Express} from 'express-serve-static-core';
import { httpServer, expressApp} from '../../src/app'
import DoneCallback = jest.DoneCallback;
import {createHttpTerminator} from 'http-terminator';
import {HttpTerminator} from 'http-terminator/src/types';

let express: Express;
let httpTerminator: HttpTerminator;
let route: string = '/game';

beforeAll(() => {
    express = expressApp;
    httpTerminator = createHttpTerminator({ server: httpServer })
})

afterAll(()=>{
    httpTerminator.terminate().then()
})

describe('GameRouter-routes', ()=>{
    // it('should check GameRouter up and responding', () => {
    //     expect(4).toBe(4);
    // });
    it('should check GameRouter up and responding', (done: DoneCallback) => {
        request(express)
            .get(route + '/')
            .expect(200)
            .end((err, response: Response) => {
                if (err) return done(err);
                expect(response.text).toBe('this is game');
                done()
            })
    });
})

// @ts-ignore
import request, {Response} from 'supertest';
import {Express} from 'express-serve-static-core';
import { httpServer, expressApp} from '../src/app'
import DoneCallback = jest.DoneCallback;
import {createHttpTerminator} from 'http-terminator';
import {HttpTerminator} from 'http-terminator/src/types';

let express: Express;
let httpTerminator: HttpTerminator;

beforeAll(() => {
    express = expressApp;
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
    const route: string = "/game"

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

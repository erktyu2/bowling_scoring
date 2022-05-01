import express, {Express, NextFunction, Request, Response} from 'express';
import { GameRouter } from './routers/game.router';

import dotenv from 'dotenv';

dotenv.config({path: `${__dirname}/../config/.env`});

const app: Express = express();
const port = process.env.PORT || 4000;

app.get('/', (request: Request, response: Response, next: NextFunction) => {
    response.send('This is a bowling game API-Server');
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/game', GameRouter);

const server = app.listen(port, () => {
    console.log(`Server is running at localhost:${port}`);
});

// this is required for unit tests
export {
    app as expressApp,
    server as httpServer
};

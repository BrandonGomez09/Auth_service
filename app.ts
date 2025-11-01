import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import routes from './src/infrastructure/api/routes/auth.routes';

config();

const app = express();
app.use(cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


app.use('/api/v1/auth', routes);

export default app;
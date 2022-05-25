import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { CommonRoutesConfig } from './common/common.routes';
import { TodoRouter } from './todos/todos.router';
import { AuthRouter } from './users/auth.router';
import authController from './users/auth.controller';
const mongoSanitize = require('express-mongo-sanitize');
const app: express.Application = express();
const routes: Array<CommonRoutesConfig> = [];

dotenv.config();
// here we are adding middleware to parse all incoming requests as JSON
app.use(express.json());

// here we are adding middleware to allow cross-origin requests
app.use(cors());

// here we are preparing the expressWinston logging middleware configuration,
// which will automatically log all HTTP requests handled by Express.js
app.use(morgan('dev')); //enable incoming request logging in dev mode

// here we are adding the UserRoutes to our array,
// after sending the Express.js application object to have the routes added to our app!
routes.push(new AuthRouter(app));
app.use('/', authController.protect);
app.use(mongoSanitize());
routes.push(new TodoRouter(app));

export default app;

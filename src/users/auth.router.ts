import { CommonRoutesConfig } from '../common/common.routes';
import { Application, Request, Response, NextFunction } from 'express';
import authController from './auth.controller';

export class AuthRouter extends CommonRoutesConfig {
	constructor(app: Application) {
		super(app, 'AuthRouter');
	}

	configureRoutes(): Application {
		this.app.route(`/signin`).post(authController.signin);

		this.app.route(`/signup`).post(authController.signup);

		return this.app;
	}
}

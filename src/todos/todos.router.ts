import { CommonRoutesConfig } from '../common/common.routes';
import { Application, Request, Response, NextFunction } from 'express';
import todosController from './todos.controller';

export class TodoRouter extends CommonRoutesConfig {
	constructor(app: Application) {
		super(app, 'TodoRouter');
	}

	configureRoutes(): Application {
		this.app
			.route(`/todos`)
			.get(todosController.getTodo)
			.post(todosController.createTodo);

		this.app
			.route(`/todos/:id`)
			.all((req: Request, res: Response, next: NextFunction) => {
				// this middleware function runs before any request to /users/:userId
				// but it doesn't accomplish anything just yet---
				// it simply passes control to the next applicable function below using next()
				next();
			})
			.get(todosController.getTodoById)
			.put(todosController.updateById)
			.delete(todosController.deleteById);

		return this.app;
	}
}

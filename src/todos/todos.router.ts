import mongoose from 'mongoose';
import { CommonRoutesConfig } from '../common/common.routes';
import { Application, Request, Response, NextFunction } from 'express';
import todosController from './todos.controller';
import {
	requiredFieldsValidation,
	dateValidationOnCreateTodo,
} from './validation/todo.validation';

export class TodoRouter extends CommonRoutesConfig {
	constructor(app: Application) {
		super(app, 'TodoRouter');
	}

	configureRoutes(): Application {
		this.app
			.route(`/todos`)
			.all(async (req: Request, res: Response, next: NextFunction) => {
				await todosController.updateStatusToOverDue();
				next();
			})
			.get(todosController.getTodo)
			.post([
				requiredFieldsValidation,
				dateValidationOnCreateTodo,
				todosController.createTodo,
			]);

		this.app
			.route(`/todos/:id`)
			.all((req: Request, res: Response, next: NextFunction) => {
				if (
					req.params &&
					req.params.id &&
					mongoose.isValidObjectId(req.params.id)
				) {
					todosController.updateStatusToOverDue();
					next();
				} else return res.status(400).send({ error: 'Provide a valid param' });
			})
			.get(todosController.getTodoById)
			.put(todosController.updateById)
			.delete(todosController.deleteById);

		return this.app;
	}
}

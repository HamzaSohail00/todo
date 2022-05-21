import { Request, Response } from 'express';
import TodoService from './todos.service';

class TodoController {
	async createTodo(req: Request, res: Response) {
		const todo = await TodoService.create(req.body, req.user);
		res.status(201).send({ data: todo });
	}

	async getTodo(req: Request, res: Response) {
		const todo = await TodoService.getAll(req.body, req.user);
		res.status(200).send({ data: todo });
	}

	async getTodoById(req: Request, res: Response) {
		const id: string = req.params.id;
		const todo = await TodoService.getById(id);
		res.status(200).send({ data: todo });
	}

	async deleteById(req: Request, res: Response) {
		const id: string = req.params.id;
		const todo = await TodoService.deleteById(id);
		res.status(200).send({ data: todo });
	}

	async updateById(req: Request, res: Response) {
		const id: string = req.params.id;
		const todo = await TodoService.deleteById(id);
		res.status(200).send({ data: todo });
	}
}

export default new TodoController();

import { Request, Response } from 'express';
import { TodoFindQuery } from './dto/todo.dto';
import TodoService from './todos.service';

class TodoController {
	async createTodo(req: Request, res: Response) {
		const todo = await TodoService.create(req.body, req.user);
		res.status(201).send({ data: todo });
	}

	async getTodo(req: Request, res: Response) {
		const query: TodoFindQuery = { ...req.query };
		const todo = await TodoService.getAll(query, req.user);
		res.status(200).send({ data: todo });
	}

	async getTodoById(req: Request, res: Response) {
		const id: string = req.params.id;
		const todo = await TodoService.getById(id);
		if (!todo) {
			return res.status(400).send({ error: 'Id not available' });
		}
		res.status(200).send({ data: todo });
	}

	async deleteById(req: Request, res: Response) {
		const id: string = req.params.id;
		const todo = await TodoService.deleteById(id);
		if (!todo) {
			return res.status(400).send({ error: 'Id not available' });
		}
		res.status(200).send({ data: todo });
	}

	async updateById(req: Request, res: Response) {
		const id: string = req.params.id;
		if (req.body?.status === 'Pending' && req.user.role === 'user') {
			return res.status(403).send({
				error:
					"You don't have permissions to change status from 'Done' to 'Pending' of Todo. Please contact with admin.",
			});
		}
		const todo = await TodoService.updateById(req.body, id);
		if (!todo) {
			return res.status(400).send({ error: 'Id not available' });
		}
		res.status(200).send({ data: todo });
	}
}

export default new TodoController();

import express from 'express';
import { CreateTodoDTO, TodoFindQuery, UpdateTodoDTO } from './dto/todo.dto';
import { UserDocument } from './dto/document.user.dto';
import Todos from './todos.model';
import { TodoCRUD } from '../common/TodoCRUD.interface';

class TodoService implements TodoCRUD {
	async create(resource: CreateTodoDTO, user: UserDocument): Promise<any> {
		const createdBy = user._id;
		try {
			const { category, description } = resource;
			const doc = await Todos.create({
				category,
				description,
				status: 'Pending',
				createdBy,
			});
			return doc;
		} catch (error) {
			console.error(error);
			return error;
		}
	}

	async getAll(query: TodoFindQuery, user: UserDocument) {
		try {
			const findQuery: TodoFindQuery = {};
			if (query.category) {
				findQuery.category = query.category;
			}
			if (query.status) {
				findQuery.status = query.status;
			}
			if (user.role === 'user') {
				findQuery.createdBy = user._id;
			}
			const doc = await Todos.find({
				...findQuery,
			});

			return doc;
		} catch (error) {
			console.error(error);
			return error;
		}
	}

	async getById(id: string) {
		try {
			const doc = await Todos.findOne({
				_id: id,
			});
			return doc;
		} catch (error) {
			console.error(error);
			return error;
		}
	}

	async deleteById(id: string) {
		try {
			const doc = await Todos.findOneAndRemove({
				_id: id,
			});
			return doc;
		} catch (error) {
			console.error(error);
			return error;
		}
	}

	async updateById(resource: UpdateTodoDTO, id: string) {
		try {
			const updatedDoc = await Todos.updateOne(
				{ _id: id },
				{ ...resource },
				{ new: true }
			)
				.lean()
				.exec();
			return updatedDoc;
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error(error);
			return error;
		}
	}
}

export default new TodoService();

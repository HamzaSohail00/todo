import { CreateTodoDTO, TodoFindQuery, UpdateTodoDTO } from './dto/todo.dto';
import { UserDocument } from './dto/document.user.dto';
import Todos from './todos.model';
import { TodoCRUD } from '../common/TodoCRUD.interface';

class TodoService implements TodoCRUD {
	async create(resource: CreateTodoDTO, user: UserDocument): Promise<any> {
		const createdBy = user._id;
		try {
			const { category, description, startTime, endTime } = resource;
			const timeSlotBooked = await Todos.findOne({
				endTime: { $gte: new Date(endTime) },
				status: 'Pending',
				createdBy,
			});
			if (timeSlotBooked) {
				throw `Please complete the previous task`;
			}
			const todo = await Todos.create({
				category,
				description,
				status: 'Pending',
				createdBy,
				endTime,
				startTime,
			});
			return todo;
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
			if (user.role === 'admin' && query.createdBy) {
				findQuery.createdBy = query.createdBy;
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
			const updatedDoc = await Todos.findOneAndUpdate(
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

	async updateStatusOverDue() {
		try {
			const updatedDoc = await Todos.updateMany(
				{ endTime: { $lte: new Date() }, status: 'Pending' },
				{ status: 'Overdue' },
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

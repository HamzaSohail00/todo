import { faker } from '@faker-js/faker';
import Todos from '../../todos/todos.model';
import { UpdateTodoDTO } from '../../todos/dto/todo.dto';
const today = new Date();
const nextDay = new Date(today.setDate(today.getDate() + 1));
const previousDay = new Date(today.setDate(today.getDate() - 1));
const twoDaysBefore = new Date(today.setDate(today.getDate() - 2));

export async function createTodosData(todo: UpdateTodoDTO) {
	const { category, description, startTime, endTime, createdBy, status } = todo;
	const resTodo = await Todos.create({
		category: category || faker.name.findName(),
		description: description || faker.lorem.paragraph(),
		startTime: startTime || previousDay,
		endTime: endTime || today,
		createdBy: createdBy,
		status: status || 'Pending',
	});

	return resTodo;
}

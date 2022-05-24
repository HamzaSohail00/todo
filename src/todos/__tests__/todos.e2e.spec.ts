import request from 'supertest';
import app from '../../app';
import { generateAdminAndUserToken } from '../../common/test-db-utils/user.data';
import { createTodosData } from '../../common/test-db-utils/todo.data';
import { UserDocument } from '../dto/document.user.dto';
import { faker } from '@faker-js/faker';

let userToken: string;
let adminToken: string;
let user: UserDocument;
let admin: UserDocument;

beforeEach(async () => {
	const data = await generateAdminAndUserToken();
	userToken = `Bearer ${data.userToken}`;
	adminToken = `Bearer ${data.adminToken}`;
	user = data.user;
	admin = data.admin;
});

describe('Todo CRUD', () => {
	const today = new Date();
	const nextDay = new Date(today.setDate(today.getDate() + 1));
	const previousDay = new Date(today.setDate(today.getDate() - 1));
	const twoDaysBefore = new Date(today.setDate(today.getDate() - 2));

	describe('Create Todo', () => {
		test('Create Todo: Succesfully', async () => {
			const res = await request(app)
				.post('/todos')
				.set('Authorization', userToken)
				.send({
					category: faker.name.findName(),
					description: faker.lorem.paragraph(),
					startTime: previousDay,
					endTime: nextDay,
				});
			expect(res.statusCode).toEqual(201);
			expect(res.body.data).toHaveProperty('category');
			expect(res.body.data).toHaveProperty('status');
			expect(res.body.data).toHaveProperty('description');
			expect(res.body.data).toHaveProperty('createdBy');
			expect(res.body.data).toHaveProperty('startTime');
			expect(res.body.data).toHaveProperty('endTime');
			expect(res.body.data.status).toBe('Pending');
		});

		test('category is required', async () => {
			const res = await request(app)
				.post('/todos')
				.set('Authorization', userToken)
				.send({
					category: faker.name.findName(),
					startTime: previousDay,
					endTime: nextDay,
				});
			expect(res.statusCode).toEqual(400);
		});

		test('description is required', async () => {
			const res = await request(app)
				.post('/todos')
				.set('Authorization', userToken)
				.send({
					category: faker.name.findName(),
					startTime: previousDay,
					endTime: nextDay,
				});
			expect(res.statusCode).toEqual(400);
		});

		test('startTime is required', async () => {
			const res = await request(app)
				.post('/todos')
				.set('Authorization', userToken)
				.send({
					category: faker.name.findName(),
					description: faker.lorem.paragraph(),
					endTime: nextDay,
				});
			expect(res.statusCode).toEqual(400);
		});

		test('endTime is required', async () => {
			const res = await request(app)
				.post('/todos')
				.set('Authorization', userToken)
				.send({
					category: faker.name.findName(),
					description: faker.lorem.paragraph(),
					startTime: previousDay,
				});
			expect(res.statusCode).toEqual(400);
		});
	});

	describe('Update Todo', () => {
		test('Update Todo: Succesfully', async () => {
			const todo = await createTodosData({
				createdBy: user._id,
				startTime: previousDay,
				endTime: nextDay,
			});
			const res = await request(app)
				.put(`/todos/${todo._id}`)
				.set('Authorization', userToken)
				.send({
					status: 'Done',
				});
			expect(res.statusCode).toEqual(200);
		});

		test('User should be forbidden for changing status from Done to Pending', async () => {
			const todo = await createTodosData({
				createdBy: user._id,
				startTime: previousDay,
				endTime: nextDay,
				status: 'Done',
			});
			const res = await request(app)
				.put(`/todos/${todo._id}`)
				.set('Authorization', userToken)
				.send({
					status: 'Pending',
				});
			expect(res.statusCode).toEqual(403);
		});

		test('should change status to Overdue if endTime is passed', async () => {
			const res = await request(app)
				.post('/todos')
				.set('Authorization', userToken)
				.send({
					category: faker.name.findName(),
					description: faker.lorem.paragraph(),
					startTime: twoDaysBefore,
					endTime: previousDay,
				});
			expect(res.statusCode).toEqual(201);

			const getTodos = await request(app)
				.get(`/todos/${res.body.data._id}`)
				.set('Authorization', userToken)
				.send();
			expect(getTodos.body.data.status).toBe('Overdue');
		});
	});

	describe('Get Todo', () => {
		test('Get Todos as admin: get all todos including users and admins', async () => {
			await Promise.all([
				createTodosData({
					createdBy: user._id,
					startTime: previousDay,
					endTime: previousDay,
				}),
				createTodosData({
					createdBy: user._id,
					startTime: today,
					endTime: today,
				}),
				createTodosData({
					createdBy: admin._id,
					startTime: today,
					endTime: nextDay,
				}),
			]);
			const res = await request(app)
				.get(`/todos`)
				.set('Authorization', adminToken)
				.send();
			expect(res.statusCode).toEqual(200);
			expect(res.body.data.length).toEqual(3);
		});

		test('Get Todos as user: get todos of this user only excluding other users and admins', async () => {
			await Promise.all([
				createTodosData({
					createdBy: user._id,
					startTime: previousDay,
					endTime: previousDay,
				}),
				createTodosData({
					createdBy: user._id,
					startTime: today,
					endTime: today,
				}),
				createTodosData({
					createdBy: admin._id,
					startTime: today,
					endTime: nextDay,
				}),
			]);
			const res = await request(app)
				.get(`/todos`)
				.set('Authorization', userToken)
				.send();
			expect(res.statusCode).toEqual(200);
			expect(res.body.data.length).toEqual(2);
		});

		test('Get Todo search by status: /todos', async () => {
			await Promise.all([
				createTodosData({
					createdBy: user._id,
					startTime: previousDay,
					endTime: previousDay,
					status: 'Done',
				}),
				createTodosData({
					createdBy: user._id,
					startTime: today,
					endTime: nextDay,
					status: 'Pending',
				}),
			]);
			const res = await request(app)
				.get(`/todos?status=Done`)
				.set('Authorization', adminToken)
				.send();
			expect(res.statusCode).toEqual(200);
			expect(res.body.data.length).toEqual(1);
			expect(res.body.data[0].status).toBe('Done');
		});

		test('Get Todo search by category: /todos', async () => {
			await Promise.all([
				createTodosData({
					createdBy: user._id,
					category: 'Task 2',
				}),
				createTodosData({
					createdBy: user._id,
					category: 'Task 3',
				}),
			]);
			const res = await request(app)
				.get(`/todos?category=Task 2`)
				.set('Authorization', userToken)
				.send();
			expect(res.statusCode).toEqual(200);
			expect(res.body.data.length).toEqual(1);
			expect(res.body.data[0].category).toBe('Task 2');
		});
	});

	describe('Delete Todo', () => {
		test('Get Todo: /todos', async () => {
			const todo = await createTodosData({
				createdBy: user._id,
			});
			const res = await request(app)
				.delete(`/todos/${todo._id}`)
				.set('Authorization', adminToken)
				.send();
			expect(res.statusCode).toEqual(200);
			expect(res.body.data._id).toBe(todo._id.toString());
		});
	});
});

import request from 'supertest';
import app from '../../app';
// import db from '../../common/test-db-utils/test-db-setup';

let userToken: string;
let adminToken: string;

beforeAll(async () => {
	// await db.connect();
	const res = await request(app).post('/signup').send({
		email: 'user@tintash.com',
		name: 'Hamza Sohail',
		role: 'user',
		password: '123456789',
	});
	userToken = `Bearer ${res.body.token}`;

	const resAdmin = await request(app).post('/signup').send({
		email: 'admin@tintash.com',
		name: 'Hamza Sohail',
		role: 'admin',
		password: '123456789',
	});
	adminToken = `Bearer ${resAdmin.body.token}`;
});
// afterAll(async () => {
// 	await db.clear();
// 	await db.close();
// });

describe('Todo CRUD', () => {
	const today = new Date();
	const nextDay = new Date(today.setDate(today.getDate() + 1));
	const previousDay = new Date(today.setDate(today.getDate() - 1));
	const twoDaysBefore = new Date(today.setDate(today.getDate() - 2));

	let todoId: string;
	describe('Create Todo', () => {
		test('Create Todo: Succesfully', async () => {
			const res = await request(app)
				.post('/todos')
				.set('Authorization', userToken)
				.send({
					category: 'Swvl',
					description: 'Preperation',
					startTime: previousDay,
					endTime: nextDay,
				});
			todoId = res.body.data._id;
			expect(res.statusCode).toEqual(201);
			expect(res.body.data).toHaveProperty('category');
			expect(res.body.data).toHaveProperty('status');
			expect(res.body.data).toHaveProperty('description');
			expect(res.body.data).toHaveProperty('createdBy');
			expect(res.body.data).toHaveProperty('startTime');
			expect(res.body.data).toHaveProperty('endTime');
			expect(res.body.data.status).toBe('Pending');
		});
		test('caetgory is required', async () => {
			const res = await request(app)
				.post('/todos')
				.set('Authorization', userToken)
				.send({
					description: 'Preperation',
					startTime: '2022-06-22T17:48:34.386Z',
					endTime: '2022-10-22T17:56:34.386Z',
				});
			expect(res.statusCode).toEqual(400);
		});
		test('description is required', async () => {
			const res = await request(app)
				.post('/todos')
				.set('Authorization', userToken)
				.send({
					category: 'Swvl',
					startTime: '2022-06-22T17:48:34.386Z',
					endTime: '2022-10-22T17:56:34.386Z',
				});
			expect(res.statusCode).toEqual(400);
		});
		test('startTime is required', async () => {
			const res = await request(app)
				.post('/todos')
				.set('Authorization', userToken)
				.send({
					category: 'Swvl',
					description: 'Preperation',
					endTime: '2022-10-22T17:56:34.386Z',
				});
			expect(res.statusCode).toEqual(400);
		});
		test('endTime is required', async () => {
			const res = await request(app)
				.post('/todos')
				.set('Authorization', userToken)
				.send({
					category: 'Swvl',
					description: 'Preperation',
					startTime: '2022-06-22T17:48:34.386Z',
				});
			expect(res.statusCode).toEqual(400);
		});
	});

	describe('Update Todo', () => {
		test('Update Todo: Succesfully', async () => {
			const res = await request(app)
				.put(`/todos/${todoId}`)
				.set('Authorization', userToken)
				.send({
					status: 'Done',
				});
			expect(res.statusCode).toEqual(200);
		});

		test('User should be forbidden for changing status from Done to Pending', async () => {
			const res = await request(app)
				.put(`/todos/${todoId}`)
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
					category: 'Task 2',
					description: 'Preperation',
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
		test('Get Todo: /todos', async () => {
			const res = await request(app)
				.get(`/todos`)
				.set('Authorization', adminToken)
				.send();
			expect(res.statusCode).toEqual(200);
			expect(res.body.data.length).toEqual(2);
		});
		test('Get Todo search by status: /todos', async () => {
			const res = await request(app)
				.get(`/todos?status=Done`)
				.set('Authorization', adminToken)
				.send();
			expect(res.statusCode).toEqual(200);
			expect(res.body.data.length).toEqual(1);
			expect(res.body.data[0].status).toBe('Done');
		});
		test('Get Todo search by category: /todos', async () => {
			const res = await request(app)
				.get(`/todos?category=Task 2`)
				.set('Authorization', adminToken)
				.send();
			expect(res.statusCode).toEqual(200);
			expect(res.body.data.length).toEqual(1);
			expect(res.body.data[0].category).toBe('Task 2');
		});
	});

	describe('Delete Todo', () => {
		test('Get Todo: /todos', async () => {
			const res = await request(app)
				.delete(`/todos/${todoId}`)
				.set('Authorization', adminToken)
				.send();
			expect(res.statusCode).toEqual(200);
			expect(res.body.data._id).toEqual(todoId);
		});
	});
});

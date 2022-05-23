import request from 'supertest';
import app from '../../app';
import { createUserORAdmin } from '../../common/test-db-utils/user.data';
import { faker } from '@faker-js/faker';

describe('Users', () => {
	describe('User Signup /signup', () => {
		test('Successfully signup', async () => {
			const res = await request.agent(app).post('/signup').send({
				name: faker.name.findName(),
				email: faker.internet.email(),
				role: 'user',
				password: faker.name.findName(),
			});
			expect(res.statusCode).toEqual(201);
			expect(res.body).toHaveProperty('token');
		});

		test('Duplicate email signup', async () => {
			const email: string = faker.internet.email();
			await createUserORAdmin({ role: 'admin', email });
			const res = await request(app).post('/signup').send({
				name: faker.name.findName(),
				email: email,
				role: 'user',
				password: faker.name.findName(),
			});
			expect(res.statusCode).toEqual(400);
		});

		test('email is required', async () => {
			const res = await request(app).post('/signup').send({
				name: 'Hamza Sohail',
				role: 'admin',
				password: '123456789',
			});
			expect(res.statusCode).toEqual(400);
		});

		test('password is required', async () => {
			const res = await request(app).post('/signup').send({
				name: 'Hamza Sohail',
				email: 'admin@tintash.com',
				role: 'admin',
			});
			expect(res.statusCode).toEqual(400);
		});
	});

	describe('User Signin /signin', () => {
		test('Successfully signin', async () => {
			const password = faker.name.findName();
			const user = await createUserORAdmin({ role: 'admin', password });
			const res = await request(app).post('/signin').send({
				email: user.email,
				password: password,
			});
			expect(res.statusCode).toEqual(200);
			expect(res.body).toHaveProperty('token');
		});

		test('Invalid credentials signin', async () => {
			const user = await createUserORAdmin({ role: 'admin' });
			const res = await request(app).post('/signup').send({
				email: user.email,
				password: faker.name.findName(), //Invalid password
			});
			expect(res.statusCode).toEqual(400);
		});

		test('email is required', async () => {
			const res = await request(app).post('/signup').send({
				password: faker.name.findName(),
			});
			expect(res.statusCode).toEqual(400);
		});

		test('password is required', async () => {
			const res = await request(app).post('/signup').send({
				email: faker.internet.email(),
			});
			expect(res.statusCode).toEqual(400);
		});
	});
});

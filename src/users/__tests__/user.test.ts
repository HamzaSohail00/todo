import request from 'supertest';
import app from '../../app';
import db from '../../common/test-db-setup/test-db-setup';

const agent = request.agent(app);

beforeAll(async () => await db.connect());
afterAll(async () => {
	await db.clear();
	await db.close();
});

describe('Users', () => {
	describe('User Signup /signup', () => {
		test('Successfully signup', async () => {
			const res = await request.agent(app).post('/signup').send({
				email: 'admin@tintash.com',
				name: 'Hamza Sohail',
				role: 'admin',
				password: '123456789',
			});
			expect(res.statusCode).toEqual(201);
			expect(res.body).toHaveProperty('token');
		});

		test('Duplicate email signup', async () => {
			const res = await request(app).post('/signup').send({
				name: 'Hamza Sohail',
				role: 'admin',
				password: '123456789',
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
			const res = await request.agent(app).post('/signin').send({
				email: 'admin@tintash.com',
				password: '123456789',
			});
			expect(res.statusCode).toEqual(200);
			expect(res.body).toHaveProperty('token');
		});

		test('Invalid credentials signin', async () => {
			const res = await request(app).post('/signup').send({
				email: 'admin@tintash.com',
				password: '1234567899',
			});
			expect(res.statusCode).toEqual(400);
		});

		test('email is required', async () => {
			const res = await request(app).post('/signup').send({
				password: '123456789',
			});
			expect(res.statusCode).toEqual(400);
		});

		test('password is required', async () => {
			const res = await request(app).post('/signup').send({
				email: 'admin@tintash.com',
			});
			expect(res.statusCode).toEqual(400);
		});
	});
});

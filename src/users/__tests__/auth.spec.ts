import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import AuthController from '../auth.controller';
import db from '../../common/test-db-setup/test-db-setup';
import dotenv from 'dotenv';

dotenv.config();
beforeAll(async () => await db.connect());
afterAll(async () => {
	await db.clear();
	await db.close();
});

describe('authentication', () => {
	describe('newToken', () => {
		test('creates new jwt from user', async () => {
			const userBody: any = {
				id: new mongoose.Types.ObjectId(),
				email: 'admin@tintash.com',
				password: '123456789',
			};
			const token = await AuthController.newToken(userBody);
			const user: any = jwt.verify(token, process.env.JWT_SECRET);
			expect(user.data.id).toBe(userBody._id);
			expect(user.data.email).toBe(userBody.email);
		});
	});

	describe('verifyToken', () => {
		test('validates jwt and returns payload', async () => {
			const userBody: any = {
				id: 1,
				role: 'admin',
				email: 'admin@tintash.com',
			};
			const token = jwt.sign(userBody, process.env.JWT_SECRET);
			const user: any = await AuthController.verifyToken(token);
			expect(user.id).toBe(userBody.id);
			expect(user.email).toBe(userBody.email);
			expect(user.role).toBe(userBody.role);
		});
	});

	describe('signin', () => {
		test('requires email, password and name', async () => {
			const req: any = {
				body: {
					email: 'hamza.sohail@tintash.com',
				},
			};
			const res: any = {
				status(status: any) {
					expect(status).toBe(400);
					return this;
				},
				send(result: any) {
					expect(typeof result.message).toBe('string');
				},
			};
			await AuthController.signin(req, res);
		});

		test('require Email', async () => {
			const req: any = { body: { password: '123456789' } };
			const res: any = {
				status(status: number) {
					expect(status).toBe(400);
					return this;
				},
				send(result: any) {
					expect(typeof result.message).toBe('string');
				},
			};
			await AuthController.signin(req, res);
		});

		test('require password', async () => {
			const req: any = { body: { email: 'hello@hello.com' } };
			const res: any = {
				status(status: number) {
					expect(status).toBe(400);
					return this;
				},
				send(result: any) {
					expect(typeof result.message).toBe('string');
				},
			};
			await AuthController.signin(req, res);
		});
	});
});

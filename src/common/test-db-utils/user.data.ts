import { faker } from '@faker-js/faker';
import User from '../../users/auth.model';
import authController from '../../users/auth.controller';

export async function generateAdminAndUserToken() {
	const admin = await User.create({
		name: faker.name.findName(),
		email: faker.internet.email(),
		role: 'admin',
		password: faker.name.findName(),
	});
	const adminToken = await authController.newToken(admin);

	const user = await User.create({
		name: faker.name.findName(),
		email: faker.internet.email(),
		role: 'user',
		password: faker.name.findName(),
	});
	const userToken = await authController.newToken(user);

	return { adminToken, userToken, user, admin };
}

export async function createUserORAdmin({
	email,
	role,
	password,
}: {
	email?: string;
	role: 'user' | 'admin';
	password?: string;
}) {
	const user = await User.create({
		name: faker.name.findName(),
		email: email || faker.internet.email(),
		role: role && 'user',
		password: password || faker.name.findName(),
	});
	return user;
}

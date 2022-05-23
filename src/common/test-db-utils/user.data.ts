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
	console.log({ admin });
	const adminToken = await authController.newToken(admin);

	const user = await User.create({
		name: faker.name.findName(),
		email: faker.internet.email(),
		role: 'user',
		password: faker.name.findName(),
	});
	console.log({ user });
	const userToken = await authController.newToken(user);
	return { adminToken, userToken, user, admin };
}

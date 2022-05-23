import { NextFunction, Request, Response } from 'express';
import { UserDocument } from '../todos/dto/document.user.dto';
import jwt from 'jsonwebtoken';
import User from './auth.model';
import { TokenInterface } from './dtos/auth.dto';
import dotenv from 'dotenv';
dotenv.config();

class AuthController {
	newToken = async (user: UserDocument) => {
		return jwt.sign(
			{
				data: {
					id: user._id,
					role: user.role,
					email: user.email,
				},
			},
			process.env.JWT_SECRET
		);
	};

	verifyToken = async (token: string) => {
		return jwt.verify(token, process.env.JWT_SECRET);
	};

	protect = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const bearer = req.headers.authorization;

			if (!bearer || !bearer.startsWith('Bearer ')) {
				return res.status(401).end();
			}

			const token = bearer.split('Bearer ')[1].trim();
			let payload;

			payload = await this.verifyToken(token);
			const user = await User.findById((payload as TokenInterface).data.id)
				.select('-password')
				.lean()
				.exec();
			if (!user) {
				return res.status(401).end();
			}

			req.user = user;
			next();
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e);
			return res.status(401).end();
		}
	};

	signup = async (req: Request, res: Response) => {
		if (
			!req.body.email ||
			!req.body.password ||
			!req.body.name ||
			!req.body.role
		) {
			return res
				.status(400)
				.send({ message: 'need email, password, role and name' });
		}
		const userCheck = await User.findOne({ email: req.body.email })
			.select('email')
			.exec();

		if (userCheck) {
			return res
				.status(400)
				.send(`user with ${req.body.email} email already exist`);
		}
		try {
			const payload = req.body;
			const user = await User.create(payload);
			const token = await this.newToken(user);
			return res.status(201).send({ token });
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e);
			return res.status(400).send(e);
		}
	};

	signin = async (req: Request, res: Response) => {
		if (!req.body.email || !req.body.password) {
			return res.status(400).send({ message: 'need email and password' });
		}
		req.body.email = req.body.email.toLowerCase();
		const invalid = { message: 'Invalid email and password combination' };

		try {
			const user = await User.findOne({
				email: req.body.email,
			})
				.select('email password')
				.exec();
			if (!user) {
				return res.status(401).send(invalid);
			}
			const match = await user.checkPassword(req.body.password);
			if (!match) {
				return res.status(401).send(invalid);
			}
			const token = await this.newToken(user);
			return res.status(200).send({ token });
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e);
			res.status(500).end();
		}
	};
}

export default new AuthController();

import mongoose from 'mongoose';
export interface UserDocument {
	_id: mongoose.Types.ObjectId;
	name?: string;
	password: string;
	role: 'admin' | 'user';
	email: string;
	createdAt?: Date;
	updatedAt?: Date;
}

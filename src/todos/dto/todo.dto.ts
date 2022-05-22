import mongoose from 'mongoose';
import { Request } from 'express';
import { UserDocument } from './document.user.dto';
export interface CreateTodoDTO {
	category: string;
	description: string;
	status: string;
	createdBy: mongoose.Types.ObjectId;
	completedAt?: Date;
	startTime: Date;
	endTime: Date;
}

export interface UpdateTodoDTO extends Partial<CreateTodoDTO> {}

export interface DocumentTodoDTO {
	category: string;
	description: string;
	status: string;
	createdBy: mongoose.Types.ObjectId;
	completedAt?: Date;
	startTIme: Date;
	endTime: Date;
	createdAt: Date;
	updatedAt: Date;
}

export interface TodoFindQuery {
	category?: string;
	status?: string;
	createdBy?: mongoose.Types.ObjectId;
}

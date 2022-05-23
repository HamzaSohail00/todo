import mongooseService from '../common/services/mongoose.service';
import mongoose from 'mongoose';

let Schema = mongooseService.getMongoose().Schema;

const todoSchema = new Schema(
	{
		category: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			trim: true,
			enum: ['Pending', 'Done', 'Overdue'],
		},
		startTime: {
			type: Date,
			required: true,
		},
		endTime: {
			type: Date,
			required: true,
		},
		completedAt: Date,
		createdBy: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'users',
			required: true,
		},
	},
	{ timestamps: true }
);
export default mongooseService.getMongoose().model('todos', todoSchema);

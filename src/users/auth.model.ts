import mongooseService from '../common/services/mongoose.service';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

let Schema = mongooseService.getMongoose().Schema;

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: [true, 'Email Is Required'],
			trim: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: [true, 'Password Is Required'],
		},
		name: {
			type: String,
			required: [true, 'Name Is Required'],
			trim: true,
		},
		role: {
			type: String,
			trim: true,
			enum: ['admin', 'user'],
		},
	},
	{ timestamps: true }
);
// eslint-disable-next-line func-names
userSchema.pre('save', function (next) {
	if (!this.isModified('password')) {
		return next();
	}

	bcrypt.hash(this.password, 8, (err, hash) => {
		if (err) {
			return next(err);
		}
		this.password = hash;
		next();
	});
});

// eslint-disable-next-line func-names
userSchema.methods.checkPassword = function (password: string) {
	const passwordHash = this.password;
	return new Promise((resolve, reject) => {
		bcrypt.compare(password, passwordHash, (err, same) => {
			if (err) {
				return reject(err);
			}
			resolve(same);
		});
	});
};

export default mongooseService.getMongoose().model('users', userSchema);

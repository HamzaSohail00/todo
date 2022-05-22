import mongoose from 'mongoose';

class MongooseService {
	private count = 0;
	private mongooseOptions = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		serverSelectionTimeoutMS: 5000,
	};

	constructor() {
		this.connectWithRetry();
	}

	getMongoose() {
		return mongoose;
	}

	connectWithRetry = () => {
		console.log('Attempting MongoDB connection (will retry if needed)');
		const connectionString: string = 'mongodb://admin:secret@mongodb:27017';
		console.log({ connectionString });
		mongoose
			.connect(connectionString, this.mongooseOptions)
			.then(() => {
				console.log('MongoDB is connected');
			})
			.catch((err) => {
				const retrySeconds = 5;
				console.log(
					`MongoDBB connection unsuccessful (will retry #${++this
						.count} after ${retrySeconds} seconds):`,
					err
				);
				setTimeout(this.connectWithRetry, retrySeconds * 1000);
			});
	};
}
export default new MongooseService();

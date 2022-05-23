export {};
declare global {
	namespace Express {
		interface Request {
			user: any;
		}
	}
}

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			CONNECTION_STRING: string;
			JWT_SECRET: string;
		}
	}
}

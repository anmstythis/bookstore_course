import express from 'express';

export function createTestApp(router) {
	const app = express();
	app.use(express.json());
	app.use('/', router);
	return app;
}



import request from 'supertest';
import { createTestApp } from '../utils/createApp.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../db.js', () => ({
	default: {
		query: vi.fn()
	}
}));
import pool from '../../db.js';
import router from '../../routes/accounts.js';

describe('accounts routes', () => {
	let app;
	beforeEach(() => {
		app = createTestApp(router);
	});
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('GET / -> 200', async () => {
		pool.query.mockResolvedValueOnce({ rows: [{ id_account: 1 }] });
		const res = await request(app).get('/');
		expect(res.status).toBe(200);
	});

	it('GET /:id -> 200 and 404', async () => {
		pool.query.mockResolvedValueOnce({ rows: [{ id_account: 1 }] });
		let res = await request(app).get('/1');
		expect(res.status).toBe(200);

		pool.query.mockResolvedValueOnce({ rows: [] });
		res = await request(app).get('/999');
		expect(res.status).toBe(404);
	});

	it('PATCH /:id -> 200 updates login', async () => {
		pool.query.mockResolvedValueOnce({ rows: [{ id_account: 1, login: 'x' }] });
		const res = await request(app).patch('/1').send({ login: 'new' });
		expect(res.status).toBe(200);
	});

	it('DELETE /:id -> 200 and 404', async () => {
		pool.query.mockResolvedValueOnce({ rows: [{ id_account: 1 }] });
		let res = await request(app).delete('/1');
		expect(res.status).toBe(200);

		pool.query.mockResolvedValueOnce({ rows: [] });
		res = await request(app).delete('/999');
		expect(res.status).toBe(404);
	});
});



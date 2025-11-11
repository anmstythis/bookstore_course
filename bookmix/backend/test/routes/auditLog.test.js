import request from 'supertest';
import { createTestApp } from '../utils/createApp.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../db.js', () => ({
	default: {
		query: vi.fn()
	}
}));
import pool from '../../db.js';
import router from '../../routes/auditLog.js';

describe('auditLog routes', () => {
	let app;
	beforeEach(() => {
		app = createTestApp(router);
	});
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('GET / -> 200', async () => {
		pool.query.mockResolvedValueOnce({ rows: [] });
		const res = await request(app).get('/?table=t&action=a&user=u');
		expect(res.status).toBe(200);
	});

	it('GET /:id -> 200 and 404', async () => {
		pool.query.mockResolvedValueOnce({ rows: [{}] });
		let res = await request(app).get('/1');
		expect(res.status).toBe(200);
		pool.query.mockResolvedValueOnce({ rows: [] });
		res = await request(app).get('/999');
		expect(res.status).toBe(404);
	});

	it('POST / -> 201', async () => {
		pool.query.mockResolvedValueOnce({ rows: [{}] });
		const res = await request(app).post('/').send({
			TableName: 't',
			Record_ID: 1,
			Action: 'I',
			ChangedBy: 'u',
			OldValue: null,
			NewValue: '{}'
		});
		expect(res.status).toBe(201);
	});

	it('DELETE /:id -> 200 and 404', async () => {
		pool.query.mockResolvedValueOnce({ rows: [{}] });
		let res = await request(app).delete('/1');
		expect(res.status).toBe(200);
		pool.query.mockResolvedValueOnce({ rows: [] });
		res = await request(app).delete('/999');
		expect(res.status).toBe(404);
	});
});



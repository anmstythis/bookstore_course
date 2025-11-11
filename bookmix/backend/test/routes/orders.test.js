import request from 'supertest';
import { createTestApp } from '../utils/createApp.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../db.js', () => ({
	default: {
		query: vi.fn()
	}
}));
import pool from '../../db.js';
import router from '../../routes/orders.js';

describe('orders routes', () => {
	let app;
	beforeEach(() => {
		app = createTestApp(router);
	});
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('GET / -> 200', async () => {
		pool.query.mockResolvedValueOnce({ rows: [{ id_order: 1 }] });
		const res = await request(app).get('/');
		expect(res.status).toBe(200);
	});

	it('GET /:id -> 200 and 404', async () => {
		pool.query
			.mockResolvedValueOnce({ rows: [{ id_order: 1 }] }) // order
			.mockResolvedValueOnce({ rows: [] }); // details
		let res = await request(app).get('/1');
		expect(res.status).toBe(200);

		pool.query.mockResolvedValueOnce({ rows: [] });
		res = await request(app).get('/999');
		expect(res.status).toBe(404);
	});

	it('POST / -> 201', async () => {
		pool.query
			.mockResolvedValueOnce({ rows: [{ id_order: 10 }] }) // insert order
			.mockResolvedValue({ rows: [] }); // insert details multiple times
		const res = await request(app).post('/').send({
			user_id: 1,
			status_id: 1,
			deliverytype_id: 1,
			address_id: 1,
			items: [{ price: 10, quantity: 1, book_id: 1 }]
		});
		expect(res.status).toBe(201);
	});

	it('PUT /:id/status -> 200 and 404', async () => {
		pool.query.mockResolvedValueOnce({ rows: [{ id_order: 1 }] });
		let res = await request(app).put('/1/status').send({ status_id: 2 });
		expect(res.status).toBe(200);

		pool.query.mockResolvedValueOnce({ rows: [] });
		res = await request(app).put('/1/status').send({ status_id: 2 });
		expect(res.status).toBe(404);
	});

	it('DELETE /:id -> 200 and 404', async () => {
		pool.query
			.mockResolvedValueOnce({ rows: [{ id_order: 1 }] }) // check
			.mockResolvedValueOnce({ rows: [] }) // delete details
			.mockResolvedValueOnce({ rows: [] }); // delete order
		let res = await request(app).delete('/1');
		expect(res.status).toBe(200);

		pool.query.mockResolvedValueOnce({ rows: [] });
		res = await request(app).delete('/999');
		expect(res.status).toBe(404);
	});

	it('GET /user/:id -> 200', async () => {
		pool.query.mockResolvedValueOnce({ rows: [] });
		const res = await request(app).get('/user/1');
		expect(res.status).toBe(200);
	});
});



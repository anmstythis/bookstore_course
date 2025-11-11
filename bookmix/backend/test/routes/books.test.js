import request from 'supertest';
import { createTestApp } from '../utils/createApp.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../db.js', () => ({
	default: {
		query: vi.fn()
	}
}));
import pool from '../../db.js';
import router from '../../routes/books.js';

describe('books routes', () => {
	let app;
	beforeEach(() => {
		app = createTestApp(router);
	});
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('GET / -> 200 with list', async () => {
		pool.query.mockResolvedValueOnce({ rows: [{ id_book: 1 }] });
		const res = await request(app).get('/');
		expect(res.status).toBe(200);
	});

	it('GET /:id -> 200 and 404', async () => {
		pool.query.mockResolvedValueOnce({ rows: [{ id_book: 1 }] });
		let res = await request(app).get('/1');
		expect(res.status).toBe(200);

		pool.query.mockResolvedValueOnce({ rows: [] });
		res = await request(app).get('/999');
		expect(res.status).toBe(404);
	});

	it('POST / -> 201', async () => {
		pool.query.mockResolvedValueOnce({ rows: [{ id_book: 1 }] });
		const res = await request(app).post('/').send({
			title: 't',
			description: 'd',
			publishdate: '2020-01-01',
			author_id: 1,
			publisher_id: 1,
			category_id: 1,
			price: 10,
			quantity: 1,
			imageurl: 'u'
		});
		expect(res.status).toBe(201);
	});

	it('PUT /:id -> 200', async () => {
		pool.query.mockResolvedValueOnce({ rows: [] });
		const res = await request(app).put('/1').send({
			title: 't',
			price: 1,
			quantity: 1,
			description: 'd',
			author_id: 1,
			category_id: 1,
			imageurl: 'u'
		});
		expect(res.status).toBe(200);
	});

	it('DELETE /:id -> 200 and 404', async () => {
		pool.query.mockResolvedValueOnce({ rows: [{ id_book: 1 }] });
		let res = await request(app).delete('/1');
		expect(res.status).toBe(200);

		pool.query.mockResolvedValueOnce({ rows: [] });
		res = await request(app).delete('/999');
		expect(res.status).toBe(404);
	});
});



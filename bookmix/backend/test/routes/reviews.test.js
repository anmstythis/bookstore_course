import request from 'supertest';
import { createTestApp } from '../utils/createApp.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../db.js', () => ({
	default: {
		query: vi.fn()
	}
}));
import pool from '../../db.js';
import router from '../../routes/reviews.js';

describe('reviews routes', () => {
	let app;
	beforeEach(() => {
		app = createTestApp(router);
	});
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('GET /book/:bookId -> 200', async () => {
		pool.query.mockResolvedValueOnce({ rows: [{ id_review: 1 }] });
		const res = await request(app).get('/book/1');
		expect(res.status).toBe(200);
	});

	it('POST / -> 201', async () => {
		pool.query.mockResolvedValueOnce({ rows: [{ id_review: 1 }] });
		const res = await request(app).post('/').send({
			user_id: 1,
			book_id: 1,
			rating: 5,
			usercomment: 'good'
		});
		expect(res.status).toBe(201);
	});

	it('DELETE /:id -> 200 and 404', async () => {
		pool.query.mockResolvedValueOnce({ rows: [{ id_review: 1 }] });
		let res = await request(app).delete('/1');
		expect(res.status).toBe(200);
		pool.query.mockResolvedValueOnce({ rows: [] });
		res = await request(app).delete('/999');
		expect(res.status).toBe(404);
	});
});



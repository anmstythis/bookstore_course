import request from 'supertest';
import { createTestApp } from '../utils/createApp.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../db.js', () => ({
	default: {
		query: vi.fn()
	}
}));
import pool from '../../db.js';
import router from '../../routes/reports.js';

describe('reports routes', () => {
	let app;
	beforeEach(() => {
		app = createTestApp(router);
	});
	afterEach(() => {
		vi.clearAllMocks();
	});

	const endpoints = [
		'/orders-view',
		'/books-view',
		'/top-books-view',
		'/orderdetails-view',
		'/usersaccounts-view',
		'/top-users-view'
	];

	for (const ep of endpoints) {
		it(`GET ${ep} -> 200`, async () => {
			pool.query.mockResolvedValueOnce({ rows: [] });
			const res = await request(app).get(ep);
			expect(res.status).toBe(200);
		});
	}
});



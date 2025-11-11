import request from 'supertest';
import { createTestApp } from '../utils/createApp.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../db.js', () => ({
	default: {
		query: vi.fn()
	}
}));

import pool from '../../db.js';
import authRouter from '../../routes/auth.js';

describe('auth routes', () => {
	let app;
	beforeEach(() => {
		app = createTestApp(authRouter);
	});
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('POST /register -> 201', async () => {
		pool.query
			.mockResolvedValueOnce({ rows: [] }) 
			.mockResolvedValueOnce({ rows: [{ id_account: 1, login: 'u', role_id: 2 }] })
			.mockResolvedValueOnce({ rows: [{ id_user: 1, lastname: 'L', firstname: 'F', email: 'e', account_id: 1 }] });

		const res = await request(app).post('/register').send({
			login: 'user',
			password: 'Aa1!aaaa',
			lastname: 'L',
			firstname: 'F',
			patronymic: 'P',
			email: 'e',
			role_id: 2
		});
		expect(res.status).toBe(201);
	});

	it('POST /login -> 200', async () => {
		pool.query.mockResolvedValueOnce({
			rows: [{ id_account: 1, login: 'user', role_id: 2, rolename: 'admin', id_user: 1 }]
		});
		const res = await request(app).post('/login').send({ login: 'user', password: 'secret' });
		expect(res.status).toBe(200);
	});

	it('PATCH /reset -> 200', async () => {
		pool.query.mockResolvedValueOnce({
			rows: [{ id_account: 1, login: 'user' }]
		});
		const res = await request(app).patch('/reset').send({ login: 'user', password: 'Aa1!aaaa' });
		expect(res.status).toBe(200);
	});
});



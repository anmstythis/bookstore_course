import request from 'supertest';
import { createTestApp } from '../utils/createApp.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../db.js', () => ({
	default: {
		query: vi.fn()
	}
}));
import pool from '../../db.js';

import statuses from '../../routes/statuses.js';
import roles from '../../routes/roles.js';
import authors from '../../routes/authors.js';
import categories from '../../routes/categories.js';
import publishers from '../../routes/publishers.js';
import addresses from '../../routes/addresses.js';

function makeCrudSuite(name, router, sampleInsertBody, updateBody) {
	describe(`${name} routes`, () => {
		let app;
		beforeEach(() => {
			app = createTestApp(router);
		});
		afterEach(() => {
			vi.clearAllMocks();
		});

		it('GET / -> 200', async () => {
			pool.query.mockResolvedValueOnce({ rows: [{}] });
			const res = await request(app).get('/');
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
			const res = await request(app).post('/').send(sampleInsertBody);
			expect(res.status).toBe(201);
		});
		it('PUT /:id -> 200 and 404', async () => {
			pool.query.mockResolvedValueOnce({ rows: [{}] });
			let res = await request(app).put('/1').send(updateBody);
			expect(res.status).toBe(200);
			pool.query.mockResolvedValueOnce({ rows: [] });
			res = await request(app).put('/999').send(updateBody);
			expect(res.status).toBe(404);
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
}

makeCrudSuite('statuses', statuses, { status: 'new' }, { status: 'upd' });
makeCrudSuite('roles', roles, { rolename: 'user' }, { rolename: 'manager' });
makeCrudSuite(
	'authors',
	authors,
	{ lastname: 'L', firstname: 'F', patronymic: 'P', birthdate: '2000-01-01', deathdate: null },
	{ lastname: 'LL', firstname: 'FF', patronymic: 'PP', birthdate: '2000-01-01', deathdate: null }
);
makeCrudSuite('categories', categories, { name: 'cat' }, { name: 'cat2' });
makeCrudSuite(
	'publishers',
	publishers,
	{ legalname: 'ln', contactnum: '123', email: 'e', address_id: 1 },
	{ legalname: 'ln2', contactnum: '1234', email: 'e2', address_id: 2 }
);
makeCrudSuite(
	'addresses',
	addresses,
	{ country: 'c', city: 'c', street: 's', house: '1', apartment: '1', indexmail: '100' },
	{ country: 'c', city: 'c', street: 's', house: '2', apartment: '2', indexmail: '200' }
);



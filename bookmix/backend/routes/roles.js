import express from 'express';
import pool from '../db.js';

const router = express.Router();

// все роли
router.get('/', async (req, res) => {
	try {
		const result = await pool.query(`SELECT *FROM roles ORDER BY id_role`);
		res.json(result.rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// роль по id
router.get('/:id', async (req, res) => {
	try {
		const result = await pool.query(`SELECT *FROM roles WHERE id_role=$1`, [req.params.id]);
		if (result.rows.length === 0) return res.status(404).json({ error: 'Роль не найдена' });
		res.json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// создать роль
router.post('/', async (req, res) => {
	try {
		const { rolename } = req.body;
		const result = await pool.query(
			`INSERT INTO roles (rolename) VALUES ($1) RETURNING *`,
			[rolename]
		);
		res.status(201).json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// обновить роль
router.put('/:id', async (req, res) => {
	try {
		const { rolename } = req.body;
		const result = await pool.query(
			`UPDATE roles SET rolename=$1 WHERE id_role=$2 RETURNING *`,
			[rolename, req.params.id]
		);
		if (result.rows.length === 0) return res.status(404).json({ error: 'Роль не найдена' });
		res.json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// удалить роль
router.delete('/:id', async (req, res) => {
	try {
		const result = await pool.query(`DELETE FROM roles WHERE id_role=$1 RETURNING *`, [req.params.id]);
		if (result.rows.length === 0) return res.status(404).json({ error: 'Роль не найдена' });
		res.json({ message: 'Роль удалена' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

export default router; 
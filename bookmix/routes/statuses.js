import express from 'express';
import pool from '../db.js';

const router = express.Router();

// все статусы
router.get('/', async (req, res) => {
	try {
		const result = await pool.query(`SELECT *FROM statuses ORDER BY id_status`);
		res.json(result.rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// статус по id
router.get('/:id', async (req, res) => {
	try {
		const result = await pool.query(`SELECT *FROM statuses WHERE id_status=$1`, [req.params.id]);
		if (result.rows.length === 0) return res.status(404).json({ error: 'Статус не найден' });
		res.json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// создать статус
router.post('/', async (req, res) => {
	try {
		const { status } = req.body;
		const result = await pool.query(
			`INSERT INTO statuses (status) VALUES ($1) RETURNING *`,
			[status]
		);
		res.status(201).json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// обновить статус
router.put('/:id', async (req, res) => {
	try {
		const { status } = req.body;
		const result = await pool.query(
			`UPDATE statuses SET status=$1 WHERE id_status=$2 RETURNING *`,
			[status, req.params.id]
		);
		if (result.rows.length === 0) return res.status(404).json({ error: 'Статус не найден' });
		res.json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// удалить статус
router.delete('/:id', async (req, res) => {
	try {
		const result = await pool.query(`DELETE FROM statuses WHERE id_status=$1 RETURNING *`, [req.params.id]);
		if (result.rows.length === 0) return res.status(404).json({ error: 'Статус не найден' });
		res.json({ message: 'Статус удален' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

export default router; 
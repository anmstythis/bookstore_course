import express from 'express';
import pool from '../db.js';

const router = express.Router();

// все типы доставки
router.get('/', async (req, res) => {
	try {
		const result = await pool.query(`SELECT *FROM deliverytypes ORDER BY id_deliverytype`);
		res.json(result.rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// тип доставки по id
router.get('/:id', async (req, res) => {
	try {
		const result = await pool.query(`SELECT *FROM deliverytypes WHERE id_deliverytype=$1`, [req.params.id]);
		if (result.rows.length === 0) return res.status(404).json({ error: 'Тип доставки не найден' });
		res.json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// создать тип доставки
router.post('/', async (req, res) => {
	try {
		const { typename } = req.body;
		const result = await pool.query(
			`INSERT INTO deliverytypes (typename) VALUES ($1) RETURNING *`,
			[typename]
		);
		res.status(201).json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// обновить тип доставки
router.put('/:id', async (req, res) => {
	try {
		const { typename } = req.body;
		const result = await pool.query(
			`UPDATE deliverytypes SET typename=$1 WHERE id_deliverytype=$2 RETURNING *`,
			[typename, req.params.id]
		);
		if (result.rows.length === 0) return res.status(404).json({ error: 'Тип доставки не найден' });
		res.json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// удалить тип доставки
router.delete('/:id', async (req, res) => {
	try {
		const result = await pool.query(`DELETE FROM deliverytypes WHERE id_deliverytype=$1 RETURNING *`, [req.params.id]);
		if (result.rows.length === 0) return res.status(404).json({ error: 'Тип доставки не найден' });
		res.json({ message: 'Тип доставки удален' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

export default router; 
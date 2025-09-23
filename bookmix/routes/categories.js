import express from 'express';
import pool from '../db.js';

const router = express.Router();

// все категории
router.get('/', async (req, res) => {
	try {
		const result = await pool.query(`SELECT * FROM categories ORDER BY id_category`);
		res.json(result.rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// категория по id
router.get('/:id', async (req, res) => {
	try {
		const result = await pool.query(`SELECT * FROM categories WHERE id_category=$1`, [req.params.id]);
		if (result.rows.length === 0) return res.status(404).json({ error: 'Категория не найдена' });
		res.json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// создать категорию
router.post('/', async (req, res) => {
	try {
		const { name } = req.body;
		const result = await pool.query(
			`INSERT INTO categories (name) VALUES ($1) RETURNING *`,
			[name]
		);
		res.status(201).json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// обновить категорию
router.put('/:id', async (req, res) => {
	try {
		const { name } = req.body;
		const result = await pool.query(
			`UPDATE categories SET name=$1 WHERE id_category=$2 RETURNING *`,
			[name, req.params.id]
		);
		if (result.rows.length === 0) return res.status(404).json({ error: 'Категория не найдена' });
		res.json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// удалить категорию
router.delete('/:id', async (req, res) => {
	try {
		const result = await pool.query(`DELETE FROM categories WHERE id_category=$1 RETURNING *`, [req.params.id]);
		if (result.rows.length === 0) return res.status(404).json({ error: 'Категория не найдена' });
		res.json({ message: 'Категория удалена' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

export default router; 
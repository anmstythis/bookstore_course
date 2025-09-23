import express from 'express';
import pool from '../db.js';

const router = express.Router();

// все адреса
router.get('/', async (req, res) => {
	try {
		const result = await pool.query(`SELECT * FROM addresses ORDER BY id_address`);
		res.json(result.rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// адрес по id
router.get('/:id', async (req, res) => {
	try {
		const result = await pool.query(`SELECT * FROM addresses WHERE id_address=$1`, [req.params.id]);
		if (result.rows.length === 0) return res.status(404).json({ error: 'Адрес не найден' });
		res.json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// создать адрес
router.post('/', async (req, res) => {
	try {
		const { country, city, street, house, apartment, indexmail } = req.body;
		const result = await pool.query(
			`INSERT INTO addresses (country, city, street, house, apartment, indexmail)
			 VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
			[country, city, street, house, apartment, indexmail]
		);
		res.status(201).json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// обновить адрес
router.put('/:id', async (req, res) => {
	try {
		const { country, city, street, house, apartment, indexmail } = req.body;
		const result = await pool.query(
			`UPDATE addresses SET country=$1, city=$2, street=$3, house=$4, apartment=$5, indexmail=$6 WHERE id_address=$7 RETURNING *`,
			[country, city, street, house, apartment, indexmail, req.params.id]
		);
		if (result.rows.length === 0) return res.status(404).json({ error: 'Адрес не найден' });
		res.json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// удалить адрес
router.delete('/:id', async (req, res) => {
	try {
		const result = await pool.query(`DELETE FROM addresses WHERE id_address=$1 RETURNING *`, [req.params.id]);
		if (result.rows.length === 0) return res.status(404).json({ error: 'Адрес не найден' });
		res.json({ message: 'Адрес удален' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

export default router; 
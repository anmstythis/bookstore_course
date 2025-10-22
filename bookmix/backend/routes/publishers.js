import express from 'express';
import pool from '../db.js';

const router = express.Router();

// все издатели
router.get('/', async (req, res) => {
	try {
		const result = await pool.query(
			`SELECT *FROM publishers p
			 LEFT JOIN addresses a ON p.address_id = a.id_address
			 ORDER BY p.id_publisher`
		);
		res.json(result.rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// издатель по id
router.get('/:id', async (req, res) => {
	try {
		const result = await pool.query(`SELECT * FROM publishers WHERE id_publisher=$1`, [req.params.id]);
		if (result.rows.length === 0) return res.status(404).json({ error: 'Издатель не найден' });
		res.json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// создать издателя
router.post('/', async (req, res) => {
	try {
		const { legalname, contactnum, email, address_id } = req.body;
		const result = await pool.query(
			`INSERT INTO publishers (legalname, contactnum, email, address_id)
			 VALUES ($1,$2,$3,$4) RETURNING *`,
			[legalname, contactnum, email, address_id]
		);
		res.status(201).json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// обновить издателя
router.put('/:id', async (req, res) => {
	try {
		const { legalname, contactnum, email, address_id } = req.body;
		const result = await pool.query(
			`UPDATE publishers SET legalname=$1, contactnum=$2, email=$3, address_id=$4 WHERE id_publisher=$5 RETURNING *`,
			[legalname, contactnum, email, address_id, req.params.id]
		);
		if (result.rows.length === 0) return res.status(404).json({ error: 'Издатель не найден' });
		res.json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// удалить издателя
router.delete('/:id', async (req, res) => {
	try {
		const result = await pool.query(`DELETE FROM publishers WHERE id_publisher=$1 RETURNING *`, [req.params.id]);
		if (result.rows.length === 0) return res.status(404).json({ error: 'Издатель не найден' });
		res.json({ message: 'Издатель удален' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

export default router; 
import express from 'express';
import pool from '../db.js';

const router = express.Router();

// все авторы
router.get('/', async (req, res) => {
	try {
		const result = await pool.query(`SELECT * FROM authors ORDER BY id_author`);
		res.json(result.rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// автор по id
router.get('/:id', async (req, res) => {
	try {
		const result = await pool.query(`SELECT * FROM authors WHERE id_author=$1`, [req.params.id]);
		if (result.rows.length === 0) return res.status(404).json({ error: 'Автор не найден' });
		res.json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// создать автора
router.post('/', async (req, res) => {
	try {
		const { lastname, firstname, patronymic, birthdate, deathdate } = req.body;
		const result = await pool.query(
			`INSERT INTO authors (lastname, firstname, patronymic, birthdate, deathdate)
			 VALUES ($1,$2,$3,$4,$5) RETURNING *`,
			[lastname, firstname, patronymic, birthdate, deathdate]
		);
		res.status(201).json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// обновить автора
router.put('/:id', async (req, res) => {
	try {
		const { lastname, firstname, patronymic, birthdate, deathdate } = req.body;
		const result = await pool.query(
			`UPDATE authors SET lastname=$1, firstname=$2, patronymic=$3, birthdate=$4, deathdate=$5 WHERE id_author=$6 RETURNING *`,
			[lastname, firstname, patronymic, birthdate, deathdate, req.params.id]
		);
		if (result.rows.length === 0) return res.status(404).json({ error: 'Автор не найден' });
		res.json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// удалить автора
router.delete('/:id', async (req, res) => {
	try {
		const result = await pool.query(`DELETE FROM authors WHERE id_author=$1 RETURNING *`, [req.params.id]);
		if (result.rows.length === 0) return res.status(404).json({ error: 'Автор не найден' });
		res.json({ message: 'Автор удален' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

export default router; 
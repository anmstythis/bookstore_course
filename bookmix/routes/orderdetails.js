import express from 'express';
import pool from '../db.js';

const router = express.Router();

// все детали заказа по Order_ID
router.get('/order/:orderId', async (req, res) => {
	try {
		const result = await pool.query(
			`SELECT *FROM orderdetails od
			 JOIN books b ON od.book_id = b.id_book
			 WHERE od.order_id=$1
			 ORDER BY od.id_orderdetail`,
			[req.params.orderId]
		);
		res.json(result.rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// создать позицию заказа
router.post('/', async (req, res) => {
	try {
		const { order_id, price, quantity, book_id } = req.body;
		const result = await pool.query(
			`INSERT INTO orderdetails (order_id, price, quantity, book_id) VALUES ($1,$2,$3,$4) RETURNING *`,
			[order_id, price, quantity, book_id]
		);
		res.status(201).json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// обновить позицию заказа
router.put('/:id', async (req, res) => {
	try {
		const { price, quantity } = req.body;
		const result = await pool.query(
			`UPDATE orderdetails SET price=$1, quantity=$2 WHERE id_orderdetail=$3 RETURNING *`,
			[price, quantity, req.params.id]
		);
		if (result.rows.length === 0) return res.status(404).json({ error: 'Позиция не найдена' });
		res.json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// удалить позицию заказа
router.delete('/:id', async (req, res) => {
	try {
		const result = await pool.query(`DELETE FROM orderdetails WHERE id_orderdetail=$1 RETURNING *`, [req.params.id]);
		if (result.rows.length === 0) return res.status(404).json({ error: 'Позиция не найдена' });
		res.json({ message: 'Позиция удалена' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

export default router; 
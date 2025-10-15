import express from 'express';
import pool from '../db.js';

const router = express.Router();

// все заказы
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *FROM orders o
       JOIN users u ON o.user_id = u.id_user
       JOIN statuses s ON o.status_id = s.id_status
       LEFT JOIN deliverytypes d ON o.deliverytype_id = d.id_deliverytype
       LEFT JOIN addresses a ON o.address_id = a.id_address`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// заказ по id с деталями
router.get('/:id', async (req, res) => {
  try {
    const order = await pool.query(`SELECT * FROM orders WHERE id_order=$1`, [req.params.id]);
    if (order.rows.length === 0) return res.status(404).json({ error: "Заказ не найден" });

    const details = await pool.query(
      `SELECT od.id_orderdetail, b.title, od.price, od.quantity 
       FROM orderdetails od
       JOIN books b ON od.book_id = b.id_book
       WHERE od.order_id=$1`,
      [req.params.id]
    );

    res.json({ ...order.rows[0], details: details.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// создать заказ
router.post('/', async (req, res) => {
  try {
    const { user_id, status_id, deliverytype_id, address_id, items } = req.body;

    const order = await pool.query(
      `INSERT INTO orders (orderdate, user_id, status_id, deliverytype_id, address_id) 
       VALUES (NOW(), $1, $2, $3, $4) RETURNING id_order`,
      [user_id, status_id, deliverytype_id, address_id]
    );

    const orderId = order.rows[0].id_order;

    for (let item of items) {
      await pool.query(
        `INSERT INTO orderdetails (order_id, price, quantity, book_id) VALUES ($1, $2, $3, $4)`,
        [orderId, item.price, item.quantity, item.book_id]
      );
    }

    res.status(201).json({ message: "Заказ создан", orderId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// обновить статус заказа
router.put('/:id/status', async (req, res) => {
  try {
    const { status_id } = req.body;
    const result = await pool.query(
      `UPDATE orders SET status_id=$1 WHERE id_order=$2 RETURNING *`,
      [status_id, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Заказ не найден" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

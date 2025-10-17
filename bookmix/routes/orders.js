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
       LEFT JOIN addresses a ON o.address_id = a.id_address
       ORDER BY o.id_order DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// заказ по id с деталями
router.get('/:id', async (req, res) => {
  try {
    const orderQuery = `
      SELECT o.*, s.status, d.typename, 
             a.indexmail, a.country, a.city, a.street, a.house, a.apartment
      FROM orders o
      JOIN statuses s ON o.status_id = s.id_status
      LEFT JOIN deliverytypes d ON o.deliverytype_id = d.id_deliverytype
      LEFT JOIN addresses a ON o.address_id = a.id_address
      WHERE o.id_order = $1
    `;

    const order = await pool.query(orderQuery, [req.params.id]);
    if (order.rows.length === 0)
      return res.status(404).json({ error: "Заказ не найден" });

    const detailsQuery = `
      SELECT 
        od.id_orderdetail,
        b.id_book,
        b.title,
        b.imageurl,
        od.price,
        od.quantity,
        au.firstname || ' ' || au.lastname AS author
      FROM orderdetails od
      JOIN books b ON od.book_id = b.id_book
      LEFT JOIN authors au ON b.author_id = au.id_author
      WHERE od.order_id = $1
    `;

    const details = await pool.query(detailsQuery, [req.params.id]);

    const totalPrice = details.rows.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );

    const result = {
      ...order.rows[0],
      totalprice: totalPrice.toFixed(2),
      items: details.rows,
    };

    res.json(result);
  } catch (err) {
    console.error("Ошибка при получении заказа:", err);
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
        `INSERT INTO orderdetails (order_id, price, quantity, book_id) 
         VALUES ($1, $2, $3, $4)`,
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
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Заказ не найден" });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// удалить заказ
router.delete('/:id', async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await pool.query(`SELECT * FROM orders WHERE id_order = $1`, [orderId]);
    if (order.rows.length === 0)
      return res.status(404).json({ error: "Заказ не найден" });

    await pool.query(`DELETE FROM orderdetails WHERE order_id = $1`, [orderId]);
    await pool.query(`DELETE FROM orders WHERE id_order = $1`, [orderId]);

    res.json({ message: `Заказ с ID ${orderId} успешно удалён` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// заказы конкретного пользователя
router.get('/user/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.id_order, o.orderdate, s.status AS status_name,
              COALESCE(SUM(od.price * od.quantity), 0) AS totalprice
       FROM orders o
       JOIN statuses s ON o.status_id = s.id_status
       LEFT JOIN orderdetails od ON o.id_order = od.order_id
       WHERE o.user_id = $1
       GROUP BY o.id_order, s.status
       ORDER BY o.id_order DESC`,
      [req.params.id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;

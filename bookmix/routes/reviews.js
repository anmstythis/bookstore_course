import express from 'express';
import pool from '../db.js';

const router = express.Router();

// отзывы по книге
router.get('/book/:bookId', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *FROM reviews r
       JOIN users u ON r.user_id = u.id_user
       WHERE r.book_id=$1
       ORDER BY r.reviewdate DESC`,
      [req.params.bookId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// добавить отзыв
router.post('/', async (req, res) => {
  try {
    const { user_id, book_id, rating, usercomment } = req.body;
    const result = await pool.query(
      `INSERT INTO reviews (user_id, book_id, rating, usercomment, reviewdate) 
       VALUES ($1,$2,$3,$4,NOW()) RETURNING *`,
      [user_id, book_id, rating, usercomment]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// удалить отзыв
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(`DELETE FROM reviews WHERE id_review=$1 RETURNING *`, [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Отзыв не найден" });
    res.json({ message: "Отзыв удален" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

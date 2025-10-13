import express from 'express';
import pool from '../db.js';

const router = express.Router();

// получить все книги или отфильтрованные по категории
router.get('/', async (req, res) => {
  try {
    const { categoryId, authorId, publisherId } = req.query; 

    let query = `
      SELECT b.*, 
             a.lastname AS author_lastname, 
             a.firstname AS author_firstname,
             c.name AS category_name
      FROM books b
      LEFT JOIN authors a ON b.author_id = a.id_author
      LEFT JOIN categories c ON b.category_id = c.id_category
    `;
    const params = [];

    // условия фильтра
    if (categoryId) {
      params.push(categoryId);
      query += ` WHERE b.category_id = $${params.length}`;
    }

    if (authorId) {
      params.push(authorId);
      query += params.length === 1 ? ` WHERE b.author_id = $${params.length}` : ` AND b.author_id = $${params.length}`;
    }

    if (publisherId) {
      params.push(publisherId);
      query += params.length === 1 ? ` WHERE b.publisher_id = $${params.length}` : ` AND b.publisher_id = $${params.length}`;
    }

    query += ' ORDER BY b.id_book ASC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка при получении книг:', err);
    res.status(500).json({ error: err.message });
  }
});

// получить книгу по id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, 
              a.lastname AS author_lastname, 
              a.firstname AS author_firstname,
              c.name AS category_name
       FROM books b
       LEFT JOIN authors a ON b.author_id = a.id_author
       LEFT JOIN categories c ON b.category_id = c.id_category
       WHERE b.id_book = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Книга не найдена' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// добавить книгу
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      publishdate,
      author_id,
      publisher_id,
      category_id,
      price,
      quantity,
      imageurl,
    } = req.body;
    const result = await pool.query(
      `INSERT INTO books (title, description, publishdate, author_id, publisher_id, category_id, price, quantity, imageurl)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [
        title,
        description,
        publishdate,
        author_id,
        publisher_id,
        category_id,
        price,
        quantity,
        imageurl,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// обновить книгу
router.put('/:id', async (req, res) => {
  try {
    const { title, description, price, quantity } = req.body;
    const result = await pool.query(
      `UPDATE books SET title=$1, description=$2, price=$3, quantity=$4 WHERE id_book=$5 RETURNING *`,
      [title, description, price, quantity, req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Книга не найдена' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// удалить книгу
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM books WHERE id_book=$1 RETURNING *`,
      [req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Книга не найдена' });
    res.json({ message: 'Книга удалена' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

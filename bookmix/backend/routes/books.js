import express from 'express';
import pool from '../db.js';

const router = express.Router();

// получить все книги или отфильтрованные по категории
router.get('/', async (req, res) => {
  try {
    const { categoryId, authorId, publisherId } = req.query;

    let query = `
      SELECT 
        b.*, 
        a.lastname AS author_lastname, 
        a.firstname AS author_firstname,
        c.name AS category_name,
        p.legalname AS publisher_legalname
      FROM books b
      LEFT JOIN authors a ON b.author_id = a.id_author
      LEFT JOIN categories c ON b.category_id = c.id_category
      LEFT JOIN publishers p ON b.publisher_id = p.id_publisher
    `;

    const params = [];

    if (categoryId) {
      params.push(categoryId);
      query += ` WHERE b.category_id = $${params.length}`;
    }

    if (authorId) {
      params.push(authorId);
      query += params.length === 1
        ? ` WHERE b.author_id = $${params.length}`
        : ` AND b.author_id = $${params.length}`;
    }

    if (publisherId) {
      params.push(publisherId);
      query += params.length === 1
        ? ` WHERE b.publisher_id = $${params.length}`
        : ` AND b.publisher_id = $${params.length}`;
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
      `SELECT 
          b.*, 
          a.lastname AS author_lastname, 
          a.firstname AS author_firstname,
          c.name AS category_name,
          p.legalname AS publisher_legalname
       FROM books b
       LEFT JOIN authors a ON b.author_id = a.id_author
       LEFT JOIN categories c ON b.category_id = c.id_category
       LEFT JOIN publishers p ON b.publisher_id = p.id_publisher
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
    console.log(err);
  }
});

// обновить книгу
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, price, quantity, description, author_id, category_id, imageurl } = req.body;

    await pool.query(
      `UPDATE books
       SET title = $1,
           price = $2,
           quantity = $3,
           description = $4,
           author_id = $5,
           category_id = $6,
           imageurl = $7
       WHERE id_book = $8`,
      [title, price, quantity, description, author_id, category_id, imageurl, id]
    );

    res.json({ message: "Книга обновлена" });
  } catch (err) {
    console.error("Ошибка при обновлении книги:", err);
    res.status(500).send("Ошибка при обновлении книги");
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

import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM accounts a
       JOIN roles r ON a.role_id = r.id_role
       ORDER BY a.id_account`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT * FROM accounts a
       JOIN roles r ON a.role_id = r.id_role
       WHERE a.id_account = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Аккаунт не найден' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const fields = [];
    const values = [];
    let index = 1;

    if (req.body.login) {
      fields.push(`login = $${index++}`);
      values.push(req.body.login);
    }
    if (req.body.password) {
      fields.push(`hashpassword = crypt($${index++}, gen_salt('bf'))`);
      values.push(req.body.password);
    }
    if (req.body.role_id) {
      fields.push(`role_id = $${index++}`);
      values.push(req.body.role_id);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'Нет данных для обновления' });
    }

    values.push(id);

    const query = `
      UPDATE accounts
      SET ${fields.join(', ')}
      WHERE id_account = $${index}
      RETURNING *;
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Аккаунт не найден' });
    }

    res.json({ message: 'Аккаунт обновлён', account: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM accounts WHERE id_account = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Аккаунт не найден' });
    }

    res.json({ message: 'Аккаунт удален', deleted: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

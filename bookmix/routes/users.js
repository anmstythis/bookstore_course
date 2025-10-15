import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *FROM users u
       JOIN accounts a ON u.account_id = a.id_account
       JOIN roles r ON a.role_id = r.id_role`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM users u
       JOIN accounts a ON u.account_id = a.id_account
       JOIN roles r ON a.role_id = r.id_role
       WHERE u.id_user = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { lastname, firstname, patronymic, email } = req.body;

    if (!lastname || !firstname || !email) {
      return res.status(400).json({ error: 'Фамилия, имя и email обязательны' });
    }

    const result = await pool.query(
      `UPDATE users
       SET lastname = $1,
           firstname = $2,
           patronymic = $3,
           email = $4
       WHERE id_user = $5
       RETURNING *`,
      [lastname, firstname, patronymic || null, email, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json({
      message: 'Данные пользователя обновлены',
      user: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM users WHERE id_user=$1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Пользователь не найден' });
    res.json({ message: 'Пользователь удалён' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

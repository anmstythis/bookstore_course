import express from 'express';
import pool from '../db.js';

const router = express.Router();

// получить всех пользователей
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id_user, u.lastname, u.firstname, u.email, r.rolename 
       FROM users u
       JOIN accounts a ON u.account_id = a.id_account
       JOIN roles r ON a.role_id = r.id_role`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// зарегистрировать пользователя
router.post('/', async (req, res) => {
  try {
    const { account_id, login, password, role_id, lastname, firstname, email } = req.body;

    let effectiveAccountId = account_id;

    // если account_id не передан — создаем аккаунт
    if (!effectiveAccountId) {
      const account = await pool.query(
        `INSERT INTO accounts (login, hashpassword, role_id) VALUES ($1, crypt($2, gen_salt('bf')), $3) RETURNING id_account`,
        [login, password, role_id]
      );
      effectiveAccountId = account.rows[0].id_account;
    } else {
      // убеждаемся, что аккаунт существует
      const accCheck = await pool.query(`SELECT id_account FROM accounts WHERE id_account=$1`, [effectiveAccountId]);
      if (accCheck.rows.length === 0) return res.status(400).json({ error: 'Указанный account_id не существует' });
    }

    // создаем пользователя
    const user = await pool.query(
      `INSERT INTO users (lastname, firstname, patronymic, email, account_id) VALUES ($1,$2,$3,$4) RETURNING *`,
      [lastname, firstname, email, effectiveAccountId]
    );

    res.status(201).json(user.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

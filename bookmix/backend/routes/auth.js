import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { login, password, lastname, firstname, patronymic, email, role_id } = req.body;

    if (!role_id) {
      return res.status(400).json({ error: 'Не указана роль пользователя' });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=.,?])[A-Za-z\d!@#$%^&*()_\-+=.,?]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error: 'Пароль должен содержать минимум 8 символов, включать заглавные и строчные латинские буквы, хотя бы одну цифру и один спецсимвол',
      });
    }

    const existing = await pool.query('SELECT id_account FROM accounts WHERE login = $1', [login]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Такой логин уже существует' });
    }

    const accountResult = await pool.query(
      `INSERT INTO accounts (login, hashpassword, role_id)
       VALUES ($1, crypt($2, gen_salt('bf')), $3)
       RETURNING id_account, login, role_id`,
      [login, password, role_id]
    );

    const accountId = accountResult.rows[0].id_account;

    const userResult = await pool.query(
      `INSERT INTO users (lastname, firstname, patronymic, email, account_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id_user, lastname, firstname, email, account_id`,
      [lastname, firstname, patronymic, email, accountId]
    );

    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      account: accountResult.rows[0],
      user: userResult.rows[0],
    });

  } catch (err) {
    console.error('Ошибка регистрации:', err);
    res.status(500).json({ error: err.message });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({ error: 'Логин и пароль обязательны' });
    }

    const result = await pool.query(
      `SELECT a.id_account, a.login, a.role_id, r.rolename,
              u.id_user, u.lastname, u.firstname, u.patronymic, u.email
       FROM accounts a
       JOIN roles r ON a.role_id = r.id_role
       LEFT JOIN users u ON u.account_id = a.id_account
       WHERE a.login=$1 AND a.hashpassword = crypt($2, a.hashpassword)`,
      [login, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Неверный логин или пароль' });
    }

    res.json({
      message: 'Успешный вход',
      ...result.rows[0],
    });
  } catch (err) {
    console.error('Ошибка входа:', err);
    res.status(500).json({ error: err.message });
  }
});

router.patch('/reset', async (req, res) => {
  try {
    const { login, password } = req.body;
    if (!login || !password) {
      return res.status(400).json({ error: 'Логин и новый пароль обязательны' });
    }

    const result = await pool.query(
      `UPDATE accounts
       SET hashpassword = crypt($1, gen_salt('bf'))
       WHERE login = $2
       RETURNING *`,
      [password, login]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Аккаунт не найден' });
    }

    res.json({ message: 'Пароль успешно сброшен', account: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

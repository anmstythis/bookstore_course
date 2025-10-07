import express from 'express';
import pool from '../db.js';

const router = express.Router();

// все аккаунты (с ролями)
router.get('/', async (req, res) => {
	try {
		const result = await pool.query(
			`SELECT a.id_account, a.login, r.rolename
			 FROM accounts a
			 JOIN roles r ON a.role_id = r.id_role
			 ORDER BY a.id_account`
		);
		res.json(result.rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// аккаунт по id
router.get('/:id', async (req, res) => {
	try {
		const result = await pool.query(`SELECT id_account, login, role_id FROM accounts WHERE id_account=$1`, [req.params.id]);
		if (result.rows.length === 0) return res.status(404).json({ error: 'Аккаунт не найден' });
		res.json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// создать аккаунт
router.post('/', async (req, res) => {
	try {
		const { login, password, role_id } = req.body;
		const result = await pool.query(
			`INSERT INTO accounts (login, hashpassword, role_id) VALUES ($1, crypt($2, gen_salt('bf')), $3) RETURNING id_account, login, role_id`,
			[login, password, role_id]
		);
		res.status(201).json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// обновить роль аккаунта
router.put('/:id/role', async (req, res) => {
	try {
		const { role_id } = req.body;
		const result = await pool.query(
			`UPDATE accounts SET role_id=$1 WHERE id_account=$2 RETURNING id_account, login, role_id`,
			[role_id, req.params.id]
		);
		if (result.rows.length === 0) return res.status(404).json({ error: 'Аккаунт не найден' });
		res.json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// удалить аккаунт
router.delete('/:id', async (req, res) => {
	try {
		const result = await pool.query(`DELETE FROM accounts WHERE id_account=$1 RETURNING *`, [req.params.id]);
		if (result.rows.length === 0) return res.status(404).json({ error: 'Аккаунт не найден' });
		res.json({ message: 'Аккаунт удален' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// вход (авторизация)
router.post('/login', async (req, res) => {
    try {
        const { login, password } = req.body;
        if (!login || !password) {
            return res.status(400).json({ error: 'Логин и пароль обязательны' });
        }

        // Проверяем логин/пароль через crypt
        const result = await pool.query(
            `SELECT a.id_account, a.login, a.role_id, r.rolename
             FROM accounts a
             JOIN roles r ON a.role_id = r.id_role
             WHERE a.login=$1 AND (
               (a.hashpassword LIKE '$%' AND a.hashpassword = crypt($2, a.hashpassword))
               OR
               (a.hashpassword NOT LIKE '$%' AND a.hashpassword = $2)
             )`,
            [login, password]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Неверный логин или пароль' });
        }

        const account = result.rows[0];

        // Дополнительно получим информацию о пользователе по account_id (если есть)
        const userQuery = await pool.query(
            `SELECT id_user, lastname, firstname, email
             FROM users
             WHERE account_id = $1`,
            [account.id_account]
        );

        const user = userQuery.rows[0] || null;

        // Возвращаем простую сессию без JWT (можно расширить позже)
        res.json({
            account: {
                id_account: account.id_account,
                login: account.login,
                role_id: account.role_id,
                rolename: account.rolename
            },
            user
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router; 
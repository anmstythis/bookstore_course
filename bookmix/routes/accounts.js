import express from 'express';
import pool from '../db.js';

const router = express.Router();

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

export default router;

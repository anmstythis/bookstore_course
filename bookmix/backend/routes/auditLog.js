import express from 'express';
import pool from '../db.js'; 

const router = express.Router();

router.get('/', async (req, res) => {
  const { table, action, user } = req.query;
  try {
    let query = `SELECT * FROM AuditLog WHERE 1=1`;
    const params = [];

    if (table) {
      params.push(table);
      query += ` AND TableName = $${params.length}`;
    }
    if (action) {
      params.push(action);
      query += ` AND Action = $${params.length}`;
    }
    if (user) {
      params.push(user);
      query += ` AND ChangedBy = $${params.length}`;
    }

    query += ` ORDER BY ChangedAt DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка при получении аудита:', err);
    res.status(500).json({ error: err.message });
  }
});


router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`SELECT * FROM AuditLog WHERE ID_Audit = $1`, [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Запись не найдена' });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/', async (req, res) => {
  const { TableName, Record_ID, Action, ChangedBy, OldValue, NewValue } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO AuditLog (TableName, Record_ID, Action, ChangedBy, OldValue, NewValue)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [TableName, Record_ID, Action, ChangedBy, OldValue, NewValue]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`DELETE FROM AuditLog WHERE ID_Audit = $1 RETURNING *`, [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Запись не найдена' });

    res.json({ message: 'Удалено', deleted: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

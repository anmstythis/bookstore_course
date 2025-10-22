import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/orders-view", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM OrdersView");
    res.json(result.rows);
  } catch (error) {
    console.error("Ошибка при получении OrdersView:", error);
    res.status(500).json({ error: "Ошибка при получении OrdersView" });
  }
});

router.get("/books-view", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM BooksView");
    res.json(result.rows);
  } catch (error) {
    console.error("Ошибка при получении BooksView:", error);
    res.status(500).json({ error: "Ошибка при получении BooksView" });
  }
});

// Топ книг по отзывам и оценке
router.get("/top-books-view", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM TopBooksView");
    res.json(result.rows);
  } catch (error) {
    console.error("Ошибка при получении TopBooksView:", error);
    res.status(500).json({ error: "Ошибка при получении TopBooksView" });
  }
});

router.get("/orderdetails-view", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM OrderDetailsView");
    res.json(result.rows);
  } catch (error) {
    console.error("Ошибка при получении OrderDetailsView:", error);
    res.status(500).json({ error: "Ошибка при получении OrderDetailsView" });
  }
});

router.get("/usersaccounts-view", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM UsersAccountsView");
    res.json(result.rows);
  } catch (error) {
    console.error("Ошибка при получении UsersAccountsView:", error);
    res.status(500).json({ error: "Ошибка при получении UsersAccountsView" });
  }
});

router.get("/top-users-view", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM TopUsersView");
    res.json(result.rows);
  } catch (error) {
    console.error("Ошибка при получении TopUsersView:", error);
    res.status(500).json({ error: "Ошибка при получении TopUsersView" });
  }
});

export default router;

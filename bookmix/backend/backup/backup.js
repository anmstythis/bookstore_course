import express from "express";
import multer from "multer";
import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backupDir = __dirname; 
const formatTimestamp = (d) => {
  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  const ss = pad(d.getSeconds());
  return `${yyyy}-${mm}-${dd}_${hh}-${mi}-${ss}`;
};

router.get("/", async (req, res) => {
  try {
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
  } catch (e) {
    console.error("Ошибка при подготовке папки бэкапа:", e);
    return res.status(500).json({ error: "Не удалось подготовить папку бэкапа" });
  }

  const timestamp = formatTimestamp(new Date());
  const fileName = `bookmix_backup_${timestamp}.sql`;
  const backupPath = path.join(backupDir, fileName);
  const command = `pg_dump -U postgres -d BookMixDB -F p -f "${backupPath}"`;

  exec(command, (error) => {
    if (error) {
      console.error("Ошибка при создании бэкапа:", error);
      return res.status(500).json({ error: "Не удалось создать бэкап" });
    }
    const shouldDownload = (req.query.download ?? "false").toString().toLowerCase() === "true";
    if (shouldDownload) {
      return res.download(backupPath, fileName);
    }
    return res.json({
      message: "Бэкап успешно создан на сервере",
      file: fileName,
      path: `/api/backup/file?name=${encodeURIComponent(fileName)}`
    });
  });
});

// Создание бэкапа с передачей пароля (предпочтительно)
router.post("/", async (req, res) => {
  try {
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
  } catch (e) {
    console.error("Ошибка при подготовке папки бэкапа:", e);
    return res.status(500).json({ error: "Не удалось подготовить папку бэкапа" });
  }

  const password =
    (req.body && req.body.password) ||
    req.headers["x-pg-password"] ||
    req.query.password ||
    "";

  const timestamp = formatTimestamp(new Date());
  const fileName = `bookmix_backup_${timestamp}.sql`;
  const backupPath = path.join(backupDir, fileName);
  const command = `pg_dump -U postgres -d BookMixDB -F p -f "${backupPath}"`;

  exec(command, { env: { ...process.env, PGPASSWORD: password } }, (error) => {
    if (error) {
      console.error("Ошибка при создании бэкапа:", error);
      return res.status(500).json({ error: "Не удалось создать бэкап" });
    }
    const shouldDownload =
      ((req.body && req.body.download) ?? req.query.download ?? "false")
        .toString()
        .toLowerCase() === "true";
    if (shouldDownload) {
      return res.download(backupPath, fileName);
    }
    return res.json({
      message: "Бэкап успешно создан на сервере",
      file: fileName,
      path: `/api/backup/file?name=${encodeURIComponent(fileName)}`
    });
  });
});

// Отдельная ручка для скачивания текущего файла бэкапа
router.get("/file", async (req, res) => {
  const { name } = req.query;
  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "Не указано имя файла (?name=...)" });
  }
  const safeName = path.basename(name);
  const backupPath = path.join(backupDir, safeName);
  if (!fs.existsSync(backupPath)) {
    return res.status(404).json({ error: "Файл бэкапа не найден" });
  }
  return res.download(backupPath, safeName);
});


router.post("/restore", upload.single("file"), async (req, res) => {
  const filePath = req.file.path;
  const password =
    (req.body && req.body.password) ||
    req.headers["x-pg-password"] ||
    req.query.password ||
    "";
  const command = `psql -U postgres -d BookMixDB -f "${filePath}"`;

  exec(command, { env: { ...process.env, PGPASSWORD: password } }, (error) => {
    fs.unlinkSync(filePath);
    if (error) {
      console.error("Ошибка при восстановлении:", error);
      return res.status(500).json({ error: "Не удалось восстановить БД" });
    }
    res.json({ message: "База данных успешно восстановлена!" });
  });
});

export default router;

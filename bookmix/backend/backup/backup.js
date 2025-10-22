import express from "express";
import multer from "multer";
import { exec } from "child_process";
import path from "path";
import fs from "fs";

const router = express.Router();
const upload = multer({ dest: "uploads/" });


router.get("/", async (req, res) => {
  const backupPath = path.join(process.cwd(), "backup", "bookmix_backup.sql");
  const command = `pg_dump -U postgres -d BookMixDB -F p -f "${backupPath}"`;

  exec(command, (error) => {
    if (error) {
      console.error("Ошибка при создании бэкапа:", error);
      return res.status(500).json({ error: "Не удалось создать бэкап" });
    }
    res.download(backupPath);
  });
});


router.post("/restore", upload.single("file"), async (req, res) => {
  const filePath = req.file.path;
  const command = `psql -U postgres -d BookMixDB -f "${filePath}"`;

  exec(command, (error) => {
    fs.unlinkSync(filePath);
    if (error) {
      console.error("Ошибка при восстановлении:", error);
      return res.status(500).json({ error: "Не удалось восстановить БД" });
    }
    res.json({ message: "База данных успешно восстановлена!" });
  });
});

export default router;

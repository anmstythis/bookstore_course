import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header.js";
import Form from "../components/Form.js";
import api from "../axiosSetup.js";

const BackupRestore = () => {
  const [backupFile, setBackupFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSection, setShowSection] = useState("backup"); 

  const handleBackup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await api.get("/backup", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "bookmix_backup.sql";
      document.body.appendChild(a);
      a.click();
      a.remove();

      setSuccess("Бэкап успешно создан и загружен!");
    } catch (err) {
      console.error("Ошибка при создании бэкапа:", err);
      setError("Не удалось создать бэкап.");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (e) => {
    e.preventDefault();
    if (!backupFile) {
        setError("Пожалуйста, выберите файл для восстановления.");
        return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
        const formData = new FormData();
        formData.append("file", backupFile);

        await api.post("backup/restore", formData);

        setSuccess("База данных успешно восстановлена из бэкапа!");
        setBackupFile(null);
    } catch (error) {
        console.error("Ошибка при восстановлении:", error);
        setError("Не удалось восстановить базу данных.");
    } finally {
        setLoading(false);
    }
    };


  return (
    <div>
      <Header
        title="Бэкап и восстановление БД"
        description="Создайте резервную копию базы данных или восстановите её из файла"
      />

      <div className="formContainer">
        <div className="toggleSection">
          <button
            className={`menuItem ${showSection === "backup" ? "activeTab" : ""}`}
            onClick={() => setShowSection("backup")}
          >
            Создание бэкапа
          </button>
          <button
            className={`menuItem ${showSection === "restore" ? "activeTab" : ""}`}
            onClick={() => setShowSection("restore")}
          >
            Восстановление
          </button>
        </div>

        {showSection === "backup" ? (
          <Form
            onSubmit={handleBackup}
            loading={loading}
            error={error}
            success={success}
            submitLabel="Создать бэкап"
            loadingLabel="Создание..."
          >
            <p className="formHint">
              Нажмите кнопку ниже, чтобы создать резервную копию базы данных.
            </p>
          </Form>
        ) : (
          <Form
            onSubmit={handleRestore}
            loading={loading}
            error={error}
            success={success}
            submitLabel="Восстановить БД"
            loadingLabel="Восстановление..."
          >
            <label className="formLabel">Выберите файл бэкапа (.sql)</label>
            <input
              className="formInput"
              type="file"
              accept=".sql"
              onChange={(e) => setBackupFile(e.target.files[0])}
              required
            />
          </Form>
        )}

        <div className="hint">
          Вернуться на{" "}
          <Link className="redirectLink" to="/">
            главную
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BackupRestore;

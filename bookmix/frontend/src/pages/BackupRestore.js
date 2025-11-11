import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header.js";
import Form from "../components/Form.js";
import { getCurrentUser } from "../utils/userUtils.js";
import api from "../axiosSetup.js";

const BackupRestore = () => {
  const [backupFile, setBackupFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSection, setShowSection] = useState("backup"); 
  const [pgPassword, setPgPassword] = useState("");

  const handleBackup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("backup", { password: pgPassword, download: false });
      const fileName = response?.data?.file;
      alert(fileName 
        ? `Бэкап успешно создан: ${fileName}`
        : "Бэкап успешно создан на сервере.");
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
    setLoading(true);

    try {
        const formData = new FormData();
        formData.append("file", backupFile);
      if (pgPassword) {
        formData.append("password", pgPassword);
      }

        await api.post("backup/restore", formData);

        alert("База данных успешно восстановлена из бэкапа!");
        setBackupFile(null);
    } catch (error) {
        console.error("Ошибка при восстановлении:", error);
        setError("Не удалось восстановить базу данных.");
    } finally {
        setLoading(false);
    }
    };


  if (!getCurrentUser()) {
    return (
      <div>
        <Header title="Бэкап и восстановление БД" description="Вы не вошли в систему" />
        <div className="formContainer">
          <div className="hint">
            Пожалуйста, <Link className="redirectLink" to="/login">войдите</Link>.
          </div>
        </div>
      </div>
    );
  }

  else if (getCurrentUser().role_id !== 1) {
    return (
      <div>
        <Header title="Бэкап и восстановление БД" description="У Вас нет доступа." />
      </div>
    );
  }

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
            submitLabel="Создать бэкап"
            loadingLabel="Создание..."
          >
            <label className="formLabel">Пароль PostgreSQL</label>
            <input
              className="formInput"
              type="password"
              placeholder="Пароль пользователя postgres"
              value={pgPassword}
              onChange={(e) => setPgPassword(e.target.value)}
            />
          </Form>
        ) : (
          <Form
            onSubmit={handleRestore}
            loading={loading}
            error={error}
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
            <label className="formLabel">Пароль PostgreSQL</label>
            <input
              className="formInput"
              type="password"
              placeholder="Пароль пользователя postgres"
              value={pgPassword}
              onChange={(e) => setPgPassword(e.target.value)}
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

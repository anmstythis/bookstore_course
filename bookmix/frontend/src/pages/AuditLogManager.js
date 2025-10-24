import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import api from '../axiosSetup.js';
import { getCurrentUser } from '../utils/userUtils.js';
import AuditManager from '../components/AuditManager.js';

const AuditLogManager = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const [filters, setFilters] = useState({
    table: '',
    action: '',
    user: ''
  });

  const loadLogs = async (currentFilters = filters) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (currentFilters.table) params.append('table', currentFilters.table);
      if (currentFilters.action) params.append('action', currentFilters.action);
      if (currentFilters.user) params.append('user', currentFilters.user);

      const res = await api.get(`/audit?${params.toString()}`);
      setLogs(res.data);
    } catch (err) {
      console.error('Ошибка при загрузке журнала аудита:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadLogDetails = async (id) => {
    try {
      const res = await api.get(`/audit/${id}`);
      setSelectedLog(res.data);
    } catch (err) {
      console.error('Ошибка при получении деталей записи аудита:', err);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleFilterChange = (field, value) => {
    const updatedFilters = { ...filters, [field]: value };
    setFilters(updatedFilters);

    if (handleFilterChange.timeout) clearTimeout(handleFilterChange.timeout);
    handleFilterChange.timeout = setTimeout(() => {
      loadLogs(updatedFilters);
    }, 400);
  };

  if (!getCurrentUser()) {
    return (
      <div>
        <Header title="Журнал аудита" description="Вы не вошли в систему" />
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
        <Header title="Журнал аудита" description="У Вас нет доступа." />
      </div>
    );
  }

  return (
    <div>
      <Header title="Журнал аудита" description="Просмотр изменений в базе данных" />

      <div className="formContainer">
        <div className="filterForm">
          <input
            type="text"
            placeholder="Таблица..."
            className="formInput"
            value={filters.table}
            onChange={(e) => handleFilterChange('table', e.target.value)}
          />
          <select
            className="formInput"
            value={filters.action}
            onChange={(e) => handleFilterChange('action', e.target.value)}
          >
            <option value="">Все действия</option>
            <option value="INSERT">INSERT</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
          </select>
          <input
            type="text"
            placeholder="Пользователь..."
            className="formInput"
            value={filters.user}
            onChange={(e) => handleFilterChange('user', e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loader">Загрузка...</div>
      ) : (
        <div className="tableContainer">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Таблица</th>
                <th>ID записи</th>
                <th>Действие</th>
                <th>Пользователь</th>
                <th>Дата</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? (
                logs.map((log) => (
                  <tr
                    key={log.id_audit}
                    onClick={() => loadLogDetails(log.id_audit)}
                    className={selectedLog?.id_audit === log.id_audit ? 'selectedRow' : ''}
                  >
                    <td>{log.id_audit}</td>
                    <td>{log.tablename}</td>
                    <td>{log.record_id ?? '-'}</td>
                    <td>{log.action}</td>
                    <td>{log.changedby || '-'}</td>
                    <td>{new Date(log.changedat).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-items">
                    Нет данных для отображения
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {selectedLog && <AuditManager log={selectedLog} />}

      <Footer />
    </div>
  );
};

export default AuditLogManager;

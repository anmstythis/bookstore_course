import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from './Header.js';
import Footer from './Footer.js';
import api from '../axiosSetup.js';

const AuditDetails = () => {
  const { id } = useParams();
  const [log, setLog] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuditDetails = async () => {
      try {
        const res = await api.get(`/audit/${id}`);
        setLog(res.data);
      } catch (err) {
        console.error('Ошибка при получении деталей аудита:', err);
        setError('Не удалось загрузить данные журнала аудита.');
      }
    };

    fetchAuditDetails();
  }, [id]);

  if (error) return <div className="welcome">{error}</div>;
  if (!log) return <div className="welcome">Загрузка...</div>;

  return (
    <div>
      <Header title={`Журнал аудита №${log.id_audit}`} />

      <div className="order-container">
        <table className="table">
          <tbody>
            <tr>
              <th>Таблица</th>
              <td>{log.tablename}</td>
            </tr>
            <tr>
              <th>ID записи</th>
              <td>{log.record_id || '-'}</td>
            </tr>
            <tr>
              <th>Пользователь</th>
              <td>{log.changedby || 'Неизвестно'}</td>
            </tr>
            <tr>
              <th>Действие</th>
              <td>{log.action}</td>
            </tr>
            <tr>
              <th>Дата изменения</th>
              <td>{new Date(log.changedat).toLocaleString()}</td>
            </tr>
            <tr>
              <th>Старое значение</th>
              <td>
                <pre className="jsonBlock">
                  {log.oldvalue
                    ? JSON.stringify(log.oldvalue, null, 2)
                    : '—'}
                </pre>
              </td>
            </tr>
            <tr>
              <th>Новое значение</th>
              <td>
                <pre className="jsonBlock">
                  {log.newvalue
                    ? JSON.stringify(log.newvalue, null, 2)
                    : '—'}
                </pre>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="formContainer">
        <Link className="menuItem" to="/audit">← Назад к журналу аудита</Link>
      </div>

      <Footer />
    </div>
  );
};

export default AuditDetails;

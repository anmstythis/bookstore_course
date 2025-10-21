import React from 'react';

const AuditManager = ({ log }) => {
  if (!log) return null;

  return (
    <div className="order-container">
      <table className="table">
        <tbody>
          <tr>
            <th>Таблица</th>
            <td>{log.tablename}</td>
          </tr>
          <tr>
            <th>ID записи</th>
            <td>{log.record_id ?? '-'}</td>
          </tr>
          <tr>
            <th>Пользователь</th>
            <td>{log.changedby || '—'}</td>
          </tr>
          <tr>
            <th>Действие</th>
            <td>{log.action}</td>
          </tr>
          <tr>
            <th>Дата</th>
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
  );
};

export default AuditManager;

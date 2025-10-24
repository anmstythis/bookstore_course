import React, { useEffect, useState } from 'react';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import api from '../axiosSetup.js';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../utils/userUtils.js';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ role_id: '' });
  const [deletingId, setDeletingId] = useState(null);

  const fetchAccounts = async () => {
    try {
      const res = await api.get('/accounts');
      setAccounts(res.data || []);
    } catch (err) {
      console.error('Ошибка при загрузке аккаунтов:', err);
      setError('Не удалось загрузить аккаунты.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await api.get('/roles');
      setRoles(res.data || []);
    } catch (err) {
      console.error('Ошибка при загрузке ролей:', err);
    }
  };

  useEffect(() => {
    fetchAccounts();
    fetchRoles();
  }, []);

  const handleEdit = (account) => {
    setEditingId(account.id_account);
    setEditData({
      login: account.login,
      role_id: account.role_id,
      password: '',
    });
  };

  const handleSave = async (id) => {
    try {
      await api.patch(`/accounts/${id}`, editData);
      await fetchAccounts();
      setEditingId(null);
    } catch (err) {
      console.error('Ошибка при обновлении аккаунта:', err);
      setError('Не удалось обновить аккаунт.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить этот аккаунт?')) return;
    try {
      setDeletingId(id);
      await api.delete(`/accounts/${id}`);
      await fetchAccounts();
    } catch (err) {
      console.error('Ошибка при удалении аккаунта:', err);
      setError('Не удалось удалить аккаунт.');
    } finally {
      setDeletingId(null);
    }
  };

  if (!getCurrentUser()) {
    return (
      <div>
        <Header title="Управление аккаунтами" description="Вы не вошли в систему" />
        <div className="formContainer">
          <div className="hint">
            Пожалуйста, <Link className="redirectLink" to="/login">войдите</Link> или{' '}
            <Link className="redirectLink" to="/register">зарегистрируйтесь</Link>.
          </div>
        </div>
      </div>
    );
  }

  else if (getCurrentUser().role_id !== 1) {
    return (
      <div>
        <Header title="Управление аккаунтами" description="У Вас нет доступа." />
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Управление аккаунтами"
        description="Список всех зарегистрированных пользователей"
      />

      {loading ? (
        <div className="welcome">Загрузка аккаунтов...</div>
      ) : error ? (
        <div className="formError">Ошибка: {error}</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Логин</th>
              <th>Роль</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc) => (
              <tr key={acc.id_account}>
                <td>{acc.id_account}</td>

                <td>
                    {acc.login}
                </td>

                <td>
                  {editingId === acc.id_account ? (
                    <select
                        className='formInput'
                        value={editData.role_id}
                        onChange={(e) => setEditData({ ...editData, role_id: e.target.value })}
                    >
                      <option value="">Выбери роль</option>
                      {roles.map((r) => (
                        <option key={r.id_role} value={r.id_role}>
                          {r.rolename}
                        </option>
                      ))}
                    </select>
                  ) : (
                    acc.rolename
                  )}
                </td>

                <td>
                  {editingId === acc.id_account ? (
                    <>
                      <button className="menuItem" onClick={() => handleSave(acc.id_account)}>Сохранить
                      </button>
                      <button
                        className="menuItem"
                        onClick={() => setEditingId(null)}
                      >Отмена
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="menuItem" onClick={() => handleEdit(acc)}>
                        Изменить
                      </button>
                      <button
                        className="menuItem"
                        onClick={() => handleDelete(acc.id_account)}
                        disabled={deletingId === acc.id_account}
                      >
                        {deletingId === acc.id_account ? '…' : 'Удалить'}
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Footer />
    </div>
  );
};

export default Accounts;

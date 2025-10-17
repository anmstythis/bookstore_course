import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header.js';
import Form from '../components/Form.js';
import api from '../axiosSetup.js';

const Register = () => {
  const navigate = useNavigate();

  // поля формы
  const [lastname, setLastname] = useState('');
  const [firstname, setFirstname] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [role_id, setRoleId] = useState('2'); 
  const [roles, setRoles] = useState([]);  

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);

  // загружаем роли при монтировании
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await api.get('/roles'); 
        setRoles(res.data);
      } catch (err) {
        console.error('Ошибка при загрузке ролей:', err);
      }
    };
    fetchRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!role_id) {
        setError('Пожалуйста, выберите роль.');
        setLoading(false);
        return;
      }

      // создаём пользователя и аккаунт
      await api.post('/auth/register', {
        login,
        password,
        role_id,
        lastname,
        firstname,
        patronymic,
        email
      });

      // авторизация
      const { data } = await api.post('/auth/login', {
        login,
        password
      });

      // сохраняем в localStorage
      localStorage.setItem('user', JSON.stringify(data));

      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || 'Ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header title="Регистрация" description="Создайте новый аккаунт" />

      <div className="formContainer">
        <Form
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
          submitLabel="Создать аккаунт"
          loadingLabel="Создаём аккаунт..."
        >
          <label className="formLabel">Фамилия</label>
          <input
            className="formInput"
            type="text"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            placeholder="Введите фамилию"
            required
          />

          <label className="formLabel">Имя</label>
          <input
            className="formInput"
            type="text"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            placeholder="Введите имя"
            required
          />

          <label className="formLabel">Отчество</label>
          <input
            className="formInput"
            type="text"
            value={patronymic}
            onChange={(e) => setPatronymic(e.target.value)}
            placeholder="Введите отчество"
          />

          <label className="formLabel">Электронная почта</label>
          <input
            className="formInput"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Введите электронную почту"
            required
          />

          <label className="formLabel">Роль</label>
          <select
            className="formInput"
            value={role_id}
            onChange={(e) => setRoleId(e.target.value)}
            required
          >
            {roles.map((role) => (
              <option key={role.id_role} value={role.id_role}>
                {role.rolename}
              </option>
            ))}
          </select>

          <label className="formLabel">Логин</label>
          <input
            className="formInput"
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Введите логин"
            required
          />

          <label className="formLabel">Пароль</label>
          <div className="passwordWrapper">
            <input
              className="formInput"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Введите пароль"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="togglePasswordBtn"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </Form>

        <div className="hint">
          Уже есть аккаунт?{' '}
          <Link className="redirectLink" to="/login">
            Войти
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

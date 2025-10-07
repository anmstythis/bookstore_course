import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header.js';
import Form from '../components/Form.js';

const Register = () => {
  const navigate = useNavigate();
  const [lastname, setLastname] = useState('');
  const [firstname, setFirstname] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const role_id = 2;
      await axios.post('/api/users', {
        login,
        password,
        role_id,
        lastname,
        firstname,
        patronymic,
        email
      });
      const { data } = await axios.post('/api/accounts/login', { login, password });
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.error || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header title={'Регистрация'} description={'Создайте новый аккаунт'} />
      <div className="formContainer">
        <Form
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
          submitLabel={'Создать аккаунт'}
          loadingLabel={'Создаём аккаунт...'}
          >
            
          <label className="formLabel">Фамилия</label>
          <input
            className="formInput"
            type="text"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            required
          />

          <label className="formLabel">Имя</label>
          <input
            className="formInput"
            type="text"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            required
          />

          <label className="formLabel">Отчество</label>
          <input
            className="formInput"
            type="text"
            value={patronymic}
            onChange={(e) => setPatronymic(e.target.value)}
          />

          <label className="formLabel">Электронная почта</label>
          <input
            className="formInput"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="formLabel">Логин</label>
          <input
            className="formInput"
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />

          <label className="formLabel">Пароль</label>
          <input
            className="formInput"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          </Form>
          <div className="hint">
            Уже есть аккаунт? <Link className='redirectLink' to="/login">Войти</Link>
          </div>
      </div>
    </div>
  );
};

export default Register;



import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header.js';
import Form from '../components/Form.js';

const Login = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post('/api/accounts/login', { login, password });
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.error || 'Не удалось войти.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header title={'Вход'} description={'Введите логин и пароль'} />
      <div className="formContainer">
        <Form
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
          submitLabel={'Войти'}
          loadingLabel={'Входим...'}
        >
          <label className='formLabel'>Логин</label>
          <input
            className='formInput'
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />
          <label className="formLabel">Пароль</label>
          <input
            className='formInput'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form>
        <div className="hint">
            Нет аккаунта? <Link className='redirectLink' to="/register">Зарегистрируйтесь</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;



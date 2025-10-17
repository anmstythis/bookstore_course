import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header.js';
import Form from '../components/Form.js';
import api from '../axiosSetup.js';

const Login = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { login, password });
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/', { replace: true }); 
    } catch (err) {
      setError(err?.response?.data?.error || 'Не удалось войти.');
    } finally {
      setLoading(false);
    }
    window.location.reload();
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
            placeholder='Введите логин'
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
            Нет аккаунта? <Link className='redirectLink' to="/register">Зарегистрируйтесь</Link>
        </div>

        <div className="hint">
            Забыли пароль? <Link className='redirectLink' to="/reset-password">Сбросьте его</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
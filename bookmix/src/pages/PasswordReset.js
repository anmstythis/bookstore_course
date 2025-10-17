import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header.js';
import Form from '../components/Form.js';
import { getCurrentUser } from '../utils/userUtils.js';
import api from '../axiosSetup.js';

const ResetPassword = () => {
  const navigate = useNavigate();

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Пароли не совпадают.');
      return;
    }

    setLoading(true);
    try {
        if (getCurrentUser())
        {
            await api.patch(`/accounts/${getCurrentUser().id_account}`, {password, });
        }
        else
        {
            await api.patch(`/auth/reset`, {login, password});
        }

        setSuccess('Пароль успешно обновлён!');
        setPassword('');
        setConfirmPassword('');

        localStorage.removeItem('user');
        navigate('/login');
        window.location.reload();
    } catch (err) {
      console.error('Ошибка при обновлении пароля:', err);
      setError('Не удалось сбросить пароль.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header title={'Сброс пароля'} description={getCurrentUser() ? 'Введите новый пароль дважды' : 'Введите логин и новый пароль дважды'} />
      <div className="formContainer">
        <Form
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
          success={success}
          submitLabel={'Сбросить пароль'}
          loadingLabel={'Обновляем...'}
        >
            {!getCurrentUser() && (
            <>
              <label className="formLabel">Логин</label>
              <input
                className="formInput"
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Введите логин"
                required
              />
            </>
          )}
          <label className="formLabel">Новый пароль</label>
          <div className="passwordWrapper">
            <input
              className="formInput"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите новый пароль"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="togglePasswordBtn"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <label className="formLabel">Подтверждение пароля</label>
          <div className="passwordWrapper">
            <input
              className="formInput"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Подтвердите новый пароль"
              required
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
        {getCurrentUser() ? (
            <>
            Вернуться к <Link className="redirectLink" to="/account">профилю</Link>
            </>
        ) : (
            <>
            Вернуться к <Link className="redirectLink" to="/login">входу</Link>
            </>
        )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

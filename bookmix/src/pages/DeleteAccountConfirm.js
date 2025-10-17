import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header.js';
import Form from '../components/Form.js'
import { getCurrentUser } from '../utils/userUtils.js';
import api from '../axiosSetup.js';

const DeleteAccountConfirm = () =>
{
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!getCurrentUser())
  {
    return (
      <div>
        <Header title={'Удаление аккаунта'} description={'Вы не вошли в систему'} />
        <div className="formContainer">
          <div className="hint">
            Пожалуйста, <Link className='redirectLink' to="/login">войдите</Link>.
          </div>
        </div>
      </div>
    );
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!password.trim()) {
      setError('Введите пароль.');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post('/auth/login', {
        login: getCurrentUser().login,
        password: password,
      });

      await api.delete(`/users/${getCurrentUser().id_user}`);
      await api.delete(`/accounts/${getCurrentUser().id_account}`);

      localStorage.removeItem('user');
      navigate('/login', { replace: true });
      alert('Аккаунт удалён.');
    } catch (err) {
      if (err?.response?.status === 401) {
        setError('Неверный пароль.');
      } else {
        console.error('Ошибка при удалении аккаунта:', err);
        setError('Не удалось удалить аккаунт. Попробуйте позже.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Header title={'Удаление аккаунта'} description={'Подтверждение действия'} />
      <div className="formContainer">
        <Form
          onSubmit={onSubmit}
          loading={isSubmitting}
          error={error}
          submitLabel={'Подтвердить удаление'}
          loadingLabel={'Удаление...'}
          buttonClassName={'formButton'}
        >
          <label className='formLabel'>Введите текущий пароль</label>
          <input
            className='formInput'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Пароль'
            disabled={isSubmitting}
          />
        </Form>
        <div className="hint">
          Передумали удалять аккаунт?{' '}
          <Link className="redirectLink" to="/account">
            Отмена
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DeleteAccountConfirm;



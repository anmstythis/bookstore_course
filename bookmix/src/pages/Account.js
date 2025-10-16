import React, { useMemo, useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header.js';
import axios from 'axios';
import Footer from '../components/Footer.js';

const Account = () =>
{
  const navigate = useNavigate();

  const storedUser = useMemo(() => {
    try {
      const userString = localStorage.getItem('user');
      console.log(JSON.parse(userString));
      return userString ? JSON.parse(userString) : null;
    } catch (e) {
      return null;
    }
  }, []);

  const [editingField, setEditingField] = useState(null);

  const [login, setLogin] = useState(storedUser?.login);
  const [email, setEmail] = useState(storedUser?.email);
  const [lastname, setLastname] = useState(storedUser?.lastname);
  const [firstname, setFirstname] = useState(storedUser?.firstname);
  const [patronymic, setPatronymic] = useState(storedUser?.patronymic);

  const handleEditClick = (field) => {
    setEditingField(field);
  };

  const saveChanges = async () => {
    try {
      const userResponse = await axios.put(`http://localhost:5000/api/users/${storedUser.id_user}`, {
        lastname,
        firstname,
        patronymic,
        email,
      });

      if (login !== storedUser.login) {
        await axios.patch(`http://localhost:5000/api/accounts/${storedUser.id_account}`, {
          login,
        });
      }

      const updatedUser = {
        ...storedUser,
        lastname,
        firstname,
        patronymic,
        email,
        login,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      console.log('Данные обновлены:', userResponse.data);
    } catch (err) {
      console.error('Ошибка при сохранении:', err);
      alert('Ошибка при сохранении данных.');
    }
  };

  const handleBlur = async () => {
    await saveChanges();
    setEditingField(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur(); 
    }
  };

  const handleDeleteAccount = () => {
    if (!storedUser) return;
    navigate('/account/delete');
  };

  if (!storedUser)
  {
    return (
      <div>
        <Header title={'Учетная запись'} description={'Вы не вошли в систему'} />
        <div className="formContainer">
          <div className="hint">
            Пожалуйста, <Link className='redirectLink' to="/login">войдите</Link> или <Link className='redirectLink' to="/register">зарегистрируйтесь</Link>.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title={'Учетная запись'} description={'Данные вашего профиля'} />
      <table className="table">
        <thead>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Логин</th>
            <td>
              {editingField === 'login' ? (
                <input
                  className='formInput'
                  type="text"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
              ) : (
                login
              )}
            </td>
            <td>
              <button className="menuItem" onClick={() => handleEditClick('login')}>
                Изменить
              </button>
            </td>
          </tr>

          <tr>
            <th scope="row">Пароль</th>
            <td></td>
            <td>
              <button 
              className="menuItemDanger"
              onClick={() => navigate('/reset-password')}
              >Сбросить</button>
            </td>
          </tr>

          <tr>
            <th scope="row">Эл. почта</th>
            <td>
              {editingField === 'email' ? (
                <input
                  className='formInput'
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
              ) : (
                email
              )}
            </td>
            <td>
              <button className="menuItem" onClick={() => handleEditClick('email')}>
                Изменить
              </button>
            </td>
          </tr>

          <tr>
            <th scope="row">Фамилия</th>
            <td>
              {editingField === 'lastname' ? (
                <input
                  className='formInput'
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
              ) : (
                lastname
              )}
            </td>
            <td>
              <button className="menuItem" onClick={() => handleEditClick('lastname')}>
                Изменить
              </button>
            </td>
          </tr>

          <tr>
            <th scope="row">Имя</th>
            <td>
              {editingField === 'firstname' ? (
                <input
                  className='formInput'
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
              ) : (
                firstname
              )}
            </td>
            <td>
              <button className="menuItem" onClick={() => handleEditClick('firstname')}>
                Изменить
              </button>
            </td>
          </tr>

          <tr>
            <th scope="row">Отчество</th>
            <td>
              {editingField === 'patronymic' ? (
                <input
                  className='formInput'
                  type="text"
                  value={patronymic}
                  onChange={(e) => setPatronymic(e.target.value)}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
              ) : (
                patronymic
              )}
            </td>
            <td>
              <button className="menuItem" onClick={() => handleEditClick('patronymic')}>
                Изменить
              </button>
            </td>
          </tr>

          <tr>
            <th scope="row">Роль</th>
            <td>{storedUser.rolename}</td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <div className='formContainer'>
        <button
          className="menuItemDanger"
          onClick={handleDeleteAccount}
        >
         Удалить аккаунт
        </button>
      </div>
      <Footer/>
    </div>
  );
}

export default Account;
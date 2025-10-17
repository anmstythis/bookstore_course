import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import axios from 'axios';
import { getCurrentUser } from '../utils/userUtils.js';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = useMemo(() => getCurrentUser(), []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const res = await axios.get(`http://localhost:5000/api/orders/user/${user.id_user}`);
        setOrders(res.data || []);
      } catch (err) {
        console.error('Ошибка при получении заказов:', err);
        setError('Не удалось загрузить заказы.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div>
        <Header title={'Мои заказы'} description={'Вы не вошли в систему'} />
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
      <Header title={'Мои заказы'} description={orders.length === 0 ? 'У вас пока нет заказов.' : 'Список всех ваших заказов'} />

      {loading ? (
        <div className="welcome">Загрузка заказов...</div>
      ) : error ? (
        <div className="formError">Ошибка: {error}</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Номер заказа</th>
              <th>Дата оформления</th>
              <th>Статус</th>
              <th>Сумма</th>
              <th>Действие</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id_order}>
                <td>{order.id_order}</td>
                <td>{new Date(order.orderdate).toLocaleDateString()}</td>
                <td>{order.status_name || 'Неизвестен'}</td>
                <td>{order.totalprice} ₽</td>
                <td>
                  <button
                    className="menuItem"
                    onClick={() => navigate(`/orders/${order.id_order}`)}
                  >
                    Подробнее
                  </button>
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

export default Orders;

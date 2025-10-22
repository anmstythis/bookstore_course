import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import { getCurrentUser, getCurrentUserId } from '../utils/userUtils.js';
import api from '../axiosSetup.js';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState(null);

  const fetchOrders = async () => {
    if (!getCurrentUser()) return;

    try {
      const res = await api.get(`/orders/user/${getCurrentUserId()}`);
      setOrders(res.data || []);
    } catch (err) {
      console.error('Ошибка при получении заказов:', err);
      setError('Не удалось загрузить заказы.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [getCurrentUser()])

  const cancelOrder = async (id) => {
    if (!getCurrentUser()) {
      setError('Необходимо войти, чтобы отменять заказы');
      return;
    }
    if (!window.confirm('Вы действительно хотите отменить этот заказ?')) return;

    try {
      setCancelingId(id);
      await api.put(`/orders/${id}/status`, { status_id: 3 });

      await fetchOrders(); 
    } catch (err) {
      console.error('Ошибка при отмене заказа:', err);
      setError('Не удалось отменить заказ');
    } finally {
      setCancelingId(null);
    }
  };


  if (!getCurrentUser()) {
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
                <td>
                  {order.status_name !== 'Отменён' && (
                    <button
                      className="reviewDeleteBtn"
                      onClick={() => cancelOrder(order.id_order)}
                      disabled={cancelingId === order.id_order}
                    >
                      {cancelingId === order.id_order ? '…' : '✕'}
                    </button>
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

export default Orders;

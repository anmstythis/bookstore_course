import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import api from '../axiosSetup.js';
import { getCurrentUser } from '../utils/userUtils.js';

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statuses, setStatuses] = useState([]);

  // загрузка всех заказов
  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (err) {
      console.error('Ошибка при загрузке заказов:', err);
    } finally {
      setLoading(false);
    }
  };

  // загрузка списка статусов для редактирования
  const loadStatuses = async () => {
    try {
      const res = await api.get('/statuses');
      setStatuses(res.data);
    } catch (err) {
      console.error('Ошибка при загрузке статусов:', err);
    }
  };

  // загрузка деталей конкретного заказа
  const loadOrderDetails = async (id) => {
    try {
      const res = await api.get(`/orders/${id}`);
      setSelectedOrder(res.data);
    } catch (err) {
      console.error('Ошибка при получении деталей заказа:', err);
    }
  };

  // изменение статуса заказа
  const handleStatusChange = async (id, newStatusId) => {
    try {
      await api.put(`/orders/${id}/status`, { status_id: newStatusId });
      await loadOrders();
      if (selectedOrder?.id_order === id) await loadOrderDetails(id);
    } catch (err) {
      console.error('Ошибка при изменении статуса:', err);
      alert('Не удалось изменить статус заказа.');
    }
  };

  // удаление заказа
  const handleDelete = async (id) => {
    if (!window.confirm('Удалить этот заказ?')) return;
    try {
      await api.delete(`/orders/${id}`);
      setSelectedOrder(null);
      await loadOrders();
    } catch (err) {
      console.error('Ошибка при удалении заказа:', err);
    }
  };

  useEffect(() => {
    loadOrders();
    loadStatuses();
  }, []);

  if (!getCurrentUser()) {
    return (
      <div>
        <Header title="Управление заказами" description="Вы не вошли в систему" />
        <div className="formContainer">
          <div className="hint">
            Пожалуйста, <Link className="redirectLink" to="/login">войдите</Link>.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Управление заказами" description="Просмотр и изменение заказов" />

      {loading ? (
        <div className="loader">Загрузка...</div>
      ) : (
        <div className="tableContainer">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Пользователь</th>
                <th>Дата</th>
                <th>Статус</th>
                <th>Доставка</th>
                <th>Адрес</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id_order}
                  onClick={() => loadOrderDetails(order.id_order)}
                  className={selectedOrder?.id_order === order.id_order ? 'selectedRow' : ''}
                >
                  <td>{order.id_order}</td>
                  <td>{order.firstname} {order.lastname}</td>
                  <td>{new Date(order.orderdate).toLocaleString()}</td>
                  <td>
                    <select
                        className="formInput"
                        value={order.status_id}
                        onChange={(e) => handleStatusChange(order.id_order, e.target.value)}
                    >
                      {statuses.map((s) => (
                        <option key={s.id_status} value={s.id_status}>
                          {s.status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{order.typename || '-'}</td>
                  <td>{order.city ? `${order.indexmail}, ${order.country}, г. ${order.city}, ул. ${order.street}, д. ${order.house}` : '-'}</td>
                  <td>
                    <button
                      className="menuItemDanger"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(order.id_order);
                      }}
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default OrderManager;

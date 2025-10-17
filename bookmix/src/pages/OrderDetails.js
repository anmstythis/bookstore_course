import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import api from '../axiosSetup.js';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        const data = res.data;

        console.log(data);
        console.log(data.items);
        setOrder(data);
      } catch (err) {
        console.error('Ошибка при получении деталей заказа:', err);
        setError('Не удалось загрузить данные заказа.');
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (error) return <div className="welcome">{error}</div>;
  if (!order) return <div className="welcome">Загрузка...</div>;

  return (
    <div>
      <Header title={`Заказ №${order.id_order}`}/>

      <div className="order-container">
        <table className="table">
          <tbody>
            <tr>
              <th>Дата</th>
              <td>{new Date(order.orderdate).toLocaleDateString()}</td>
            </tr>
            <tr>
              <th>Статус</th>
              <td>{order.status}</td>
            </tr>
            <tr>
              <th>Сумма</th>
              <td>{order.totalprice} ₽</td>
            </tr>
            <tr>
              <th>Тип доставки</th>
              <td>{order.typename}</td>
            </tr>
            {order.address_id && (
              <tr>
                <th>Адрес доставки</th>
                <td>
                  {order.indexmail}, {order.country}, г. {order.city}, ул. {order.street}, д. {order.house}
                  {order.apartment && `, кв. ${order.apartment}`}
                </td>
              </tr>
            )}
            <tr>
              <th>Товары</th>
              <td>
                <table className="order-items-table">
                  <thead>
                    <tr>
                      <th>Обложка</th>
                      <th>Название</th>
                      <th>Автор</th>
                      <th>Количество</th>
                      <th>Цена за шт.</th>
                      <th>Итого</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, i) => (
                        <tr key={i}>
                          <td>
                            <img
                              src={item.imageurl}
                              alt={item.title}
                              className="order-item-img"
                            />
                          </td>
                          <td>{item.title}</td>
                          <td>{item.author}</td>
                          <td>{item.quantity}</td>
                          <td>{item.price} ₽</td>
                          <td>{item.price * item.quantity} ₽</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="no-items">
                          Нет информации о товарах
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>


      <div className="formContainer">
        <Link className="menuItem" to="/orders">← Назад к заказам</Link>
      </div>

      <Footer />
    </div>
  );
};

export default OrderDetails;

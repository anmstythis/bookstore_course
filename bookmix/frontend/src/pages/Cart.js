import React, { useState, useEffect } from 'react';
import Card from '../components/CardMain.js';
import Footer from '../components/Footer.js';
import Header from '../components/Header.js';
import Form from '../components/Form.js';
import { motion } from 'framer-motion';
import { getCurrentUserId } from '../utils/userUtils.js';
import { getCartFromStorage, saveCartToStorage } from '../utils/cartUtils.js';
import { useBooksData } from '../utils/booksUtils.js';
import api from '../axiosSetup.js'

const Cart = () => {
  const { data, setData } = useBooksData();
  const [deliveryTypes, setDeliveryTypes] = useState([]);
  const [selectedDeliveryType, setSelectedDeliveryType] = useState('');
  const [address, setAddress] = useState({
    country: '',
    city: '',
    street: '',
    house: '',
    apartment: '',
    indexmail: '',
  });

  const pickup = deliveryTypes.find(dt =>dt.typename.toLowerCase().includes('самовывоз'));
  const isPickup = pickup && Number(selectedDeliveryType) === pickup.id_deliverytype;

  useEffect(() => {
    const fetchDeliveryTypes = async () => {
      try {
        const response = await api.get('/deliverytypes');
        setDeliveryTypes(response.data);
      } catch (err) {
        console.error('Ошибка загрузки типов доставки:', err);
      }
    };
    fetchDeliveryTypes();
  }, []);

  const handleCartChange = (newCart) => {
    if (!getCurrentUserId()) return;

    saveCartToStorage(newCart);

    const cartByBookId = new Map(newCart.map(ci => [ci.bookId, ci.quantity]));
    setData(prev =>
      prev.map(p => ({
        ...p,
        addedAmount: cartByBookId.get(p.id) || 0,
        addedToCart: cartByBookId.has(p.id),
      }))
    );
  };

  const calculateTotalPrice = () => {
    return data.reduce((total, item) => total + item.addedAmount * item.price, 0);
  };

  const Sold = async () => {
    try {
      if (!getCurrentUserId()) return;
      const cart = getCartFromStorage();
      if (cart.length === 0) return;

      let addressId = null;
      
      if (!isPickup) {
        const addressRes = await api.post('/addresses', address);
        addressId = addressRes.data.id_address;
      }

      const orderPayload = {
        user_id: getCurrentUserId(),
        status_id: 1,
        deliverytype_id: Number(selectedDeliveryType),
        address_id: isPickup ? null : addressId,
        items: cart.map(ci => ({
          book_id: ci.bookId,
          quantity: ci.quantity,
          price: data.find(d => d.id === ci.bookId)?.price || 0,
        })),
      };;

      console.log('Создание заказа:', orderPayload);
      await api.post('/orders', orderPayload);

      saveCartToStorage([]);
      window.location.reload();
    } catch (err) {
      console.error('Ошибка при создании заказа:', err?.response?.data || err);
      alert('Не удалось оформить заказ. Проверьте корректность данных.');
    }
  };

  const BuyOption = () => {
    const total = calculateTotalPrice();
    if (total === 0) return null;

    return (
      <u><p className='total'>Общая цена: {total} руб.</p></u>
    );
  };

  return (
    <div>
      <Header
        title="Корзина"
        description={
          calculateTotalPrice() !== 0
            ? 'Вы ещё не передумали покупать книги? Так купите их прямо сейчас!'
            : 'В корзине пусто.'
        }
      />

      <motion.div
        initial={{ x: -1000, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1.5 }}
      >
        <Card
          term={d => d.addedToCart === true}
          route="cart"
          onCartChange={handleCartChange}
        />
      </motion.div>

      <BuyOption />

      {calculateTotalPrice() > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >

          <div className="formContainer">
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                Sold(); 
              }}
              submitLabel="Купить"
              loadingLabel="Оформление..."
              formClassName="form"
              buttonClassName="buyButton"
            >
              <label htmlFor="delivery" className='formLabel'>Тип доставки:</label>
              <select
                className="formInput"
                id="delivery"
                value={selectedDeliveryType}
                onChange={(e) => setSelectedDeliveryType(e.target.value)}
                required
              >
                <option value="">Выберите тип</option>
                {deliveryTypes.map(dt => (
                  <option key={dt.id_deliverytype} value={dt.id_deliverytype}>
                    {dt.typename}
                  </option>
                ))}
              </select>

              {!isPickup && (
                <>
                  <label className='formLabel'>Страна</label>
                    <input
                      className='formInput'
                      type="text"
                      placeholder="Введите страну"
                      value={address.country}
                      onChange={e => setAddress({ ...address, country: e.target.value })}
                      required
                    />
                    <label className='formLabel'>Город</label>
                    <input
                      className='formInput'
                      type="text"
                      placeholder="Введите город"
                      value={address.city}
                      onChange={e => setAddress({ ...address, city: e.target.value })}
                      required
                    />
                    <label className='formLabel'>Улица</label>
                    <input
                      className='formInput'
                      type="text"
                      placeholder="Введите улицу"
                      value={address.street}
                      onChange={e => setAddress({ ...address, street: e.target.value })}
                      required
                    />
                    <label className='formLabel'>Дом</label>
                    <input
                      className='formInput'
                      type="text"
                      placeholder="Введите номер дома"
                      value={address.house}
                      onChange={e => setAddress({ ...address, house: e.target.value })}
                      required
                    />
                    <label className='formLabel'>Квартира</label>
                    <input
                      className='formInput'
                      type="text"
                      placeholder="Введите номер квартиры"
                      value={address.apartment}
                      onChange={e => setAddress({ ...address, apartment: e.target.value })}
                    />
                    <label className='formLabel'>Почтовый индекс</label>
                    <input
                      className='formInput'
                      type="text"
                      placeholder="Введите почтовый индекс"
                      value={address.indexmail}
                      onChange={e => setAddress({ ...address, indexmail: e.target.value })}
                      required
                    />
                </>
              )}
            </Form>
          </div>
        </motion.div>
      )}
      <Footer />
    </div>
  );
};

export default Cart;

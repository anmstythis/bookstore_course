import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../components/CardMain.js';
import Footer from '../components/Footer.js';
import Header from '../components/Header.js';
import { motion } from "framer-motion";

const Cart = () => {
    const [data, setData] = useState([]);

  const getCurrentUserId = () => {
    try {
      const userRaw = localStorage.getItem('user');
      if (!userRaw) return null;
      const parsed = JSON.parse(userRaw);
      return parsed?.id_user || null;
    } catch {
      return null;
    }
  };

  const getCartFromStorage = (userId) => {
    if (!userId) return [];
    try {
      const raw = localStorage.getItem(`cart:${userId}`);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [booksRes] = await Promise.all([
          axios.get('http://localhost:5000/api/books')
        ]);
        const books = booksRes.data || [];
        const userId = getCurrentUserId();
        const cart = getCartFromStorage(userId);
        const cartByBookId = new Map(cart.map(ci => [ci.bookId, ci.quantity]));
        const mapped = books.map(b => ({
          id: b.id_book,
          name: b.title,
          price: Number(b.price),
          addedAmount: cartByBookId.get(b.id_book) || 0,
          addedToCart: cartByBookId.has(b.id_book)
        }));
        setData(mapped);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAll();
  }, []);

  const calculateTotalPrice = () => {
    return data.reduce((total, item) => {
      return total + (item.addedAmount * item.price);
    }, 0);
  };

  const BuyOption = () => {
    if (calculateTotalPrice() !== 0)
        {
            return <motion.div
            initial={{x:1000, opacity:0}}
            animate={{x:0, opacity:1}}
            transition={{ delay:0.5, duration:1.5}}
            >
                <u><p className='total'>Общая цена: {calculateTotalPrice()} руб.</p></u>
                <button className='buyButton'onClick={() => Sold()}>Купить</button>
            </motion.div>
        }
  }

  const Sold = async () => {
    try {
      const userId = getCurrentUserId();
      if (!userId) return;
      const cart = getCartFromStorage(userId);
      if (cart.length === 0) return;

      const orderPayload = {
        user_id: userId,
        status_id: 1,
        deliverytype_id: 1,
        address_id: 1,
        items: cart.map(ci => ({ book_id: ci.bookId, quantity: ci.quantity, price: (data.find(d => d.id === ci.bookId)?.price) || 0 }))
      };

      await axios.post('http://localhost:5000/api/orders', orderPayload);

      localStorage.setItem(`cart:${userId}`, JSON.stringify([]));
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  }

    return (
        <div>
            <Header
                title="Корзина"
                description={ calculateTotalPrice() !== 0 ? "Вы еще не передумали покупать книги? Так купите их прямо сейчас!" : "В корзине пусто."}
            />
            <motion.div
                initial={{x:-1000, opacity:0}}
                animate={{x:0, opacity:1}}
                transition={{ delay:0.5, duration:1.5}}
            >
                <Card
                    term = {d => d.addedToCart === true}
                    route="cart"
                />
            </motion.div>
            <BuyOption/>  
            <Footer/>
        </div>
    );
}

export default Cart;
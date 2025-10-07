import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../components/CardMain.js';
import Footer from '../components/Footer.js';
import Header from '../components/Header.js';
import { motion } from "framer-motion";

const Cart = () => {
    const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/media')
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, []);

  const calculateTotalPrice = () => {
    return data.reduce((total, item) => {
      return total + (item.addedAmount * item.price);
    }, 0);
  };

  const BuyOption = () => {
    if (calculateTotalPrice() != 0)
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

  const Sold = () => {
    const itemsInCart = data.filter(item => item.addedToCart === true);

    const updatedItems = itemsInCart.map(item => {
      const updatedItem = { ...item, addedAmount: 0, addedToCart: false };
      axios.put(`http://localhost:3001/media/${item.id}`, updatedItem)
        .then(response => {
          console.log(`Updated item ${item.id}`, response.data);
          window.location.reload();
        })
        .catch(err => console.error(err));
      return updatedItem;
    });
  }

    return (
        <div>
            <Header
                title="Корзина"
                description={ calculateTotalPrice() != 0 ? "Вы еще не передумали покупать книги? Так купите их прямо сейчас!" : "В корзине пусто."}
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
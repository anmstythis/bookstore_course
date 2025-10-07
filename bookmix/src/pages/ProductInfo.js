import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer.js';
import Header from '../components/Header.js';
import { motion } from "framer-motion"

const ProductInfo = () => {
    const { id } = useParams();

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get('http://localhost:3001/media');
          const filteredData = response.data.find(item => item.id === id);
          if (!filteredData) {
            throw new Error('Такого продукта нет!');
          }
          setData(filteredData);

        } catch (error) {
          setError(error.message);
        } 
      };
  
      fetchData();
    }, [id]);
    
      if (error) {
        return <div className='welcome'>Ошибка: {error}</div>;
      }
    
      if (!data) {
        return <div className='welcome'>Нет данных.</div>;
      }

      const addToCart = (Item) => {
        if (Item) {
          Item.addedToCart = true;
          Item.addedAmount += 1;
          axios.put(`http://localhost:3001/media/${Item.id}`, Item)
            .then(() => {
              setData({...data, [Item.id]: Item});
              console.log(Item);
            })
            .catch(err => console.error(err));
        }
      };

      const removeFromCart = (Item) => {
        if (Item) {
          if (Item.addedAmount <= 1) {
            Item.addedAmount = 0;
            Item.addedToCart = false;
          } else {
            Item.addedAmount -= 1;
          }
      
          axios.put(`http://localhost:3001/media/${Item.id}`, Item)
            .then(() => {
              setData({...data, [Item.id]: Item});
              console.log(Item);
            })
            .catch(err => console.error(err));
        }
      };
    
      const becomeFavorite = (id) => {
        if (data.id !== id) {
          console.error('Такой книги нет.');
          return;
        }

        const updatedBook = { ...data, isFavorite: !data.isFavorite };

        axios.put(`http://localhost:3001/media/${updatedBook.id}`, updatedBook)
          .then(() => {
            setData(updatedBook);
          })
          .catch(err => {
            console.error(err);
          });
      };

    return (
        <div>
            <Header
              title="Сведения о книге"
            />
            <motion.div className='productInfoCard'
              initial={{ opacity: 0, scale:0 }}
              animate={{ opacity: 1, scale: 1}}
              transition={{ delay: 0.5, duration: 1 }}
            >
                <img className='prodImg' src={data.url} />
                <button className={data.isFavorite ? 'favButton2' : 'notFavButton2'} onClick={() => becomeFavorite(id)}>❤</button>
                <h2 className='titleProd'>Название книги: {data.name}</h2>
                <h2 className='authorProd'>Автор книги: {data.author}</h2>
                <h2 className='countryProd'>Страна: {data.country}</h2>
                <div className='buttons2'>
                  <button className='cartButton' onClick={() => addToCart(data.id)}>+</button>
                  <button className='cartButton' onClick={() => removeFromCart(data)}>-</button>
                </div>
                <p className='descrProd'>Описание: {data.description}</p>
            </motion.div>
            <motion.div
              initial={{ y: 1000 }}
              animate={{ y: 0}}
              transition={{ duration: 1.5 }}
            >
              <Footer/>
            </motion.div>
        </div>
    );
};

export default ProductInfo;
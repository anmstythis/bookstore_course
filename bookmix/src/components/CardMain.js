import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CardItem from './CardItem.js';

const Card = ({ head, term, route, onCartChange }) => {
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

  const saveCartToStorage = (userId, cartItems) => {
    if (!userId) return;
    localStorage.setItem(`cart:${userId}`, JSON.stringify(cartItems));
  };

  useEffect(() => {
  const fetchData = async () => {
    try {
      const [booksRes, authorsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/books'),
        axios.get('http://localhost:5000/api/authors')
      ]);

      const authors = authorsRes.data || [];

      const userId = getCurrentUserId();
      const cart = getCartFromStorage(userId);
      const cartByBookId = new Map(cart.map(ci => [ci.bookId, ci.quantity]));

      const mapped = (booksRes.data || []).map(row => {
        const author = authors.find(a => a.id_author === row.author_id);

        return {
          id: row.id_book,
          name: row.title,
          authorId: row.author_id,
          author: author ? `${author.firstname} ${author.lastname}` : 'Неизвестный автор',
          price: Number(row.price),
          url: row.imageurl,
          categoryId: row.category_id,
          addedToCart: cartByBookId.has(row.id_book),
          addedAmount: cartByBookId.get(row.id_book) || 0,
          isFavorite: false
        };
      });

      setData(mapped);
      console.log("Полученные книги:", mapped);
    } catch (err) {
      console.error("Ошибка при загрузке данных:", err);
    }
  };

  fetchData();
}, []);


  const addToCart = (id) => {
    setData(prev => {
      const updated = prev.map(item =>
        item.id === id
          ? { ...item, addedToCart: true, addedAmount: item.addedAmount + 1 }
          : item
      );

      const userId = getCurrentUserId();
      const cart = getCartFromStorage(userId);
      const exists = cart.find(ci => ci.bookId === id);
      const newCart = exists
        ? cart.map(ci => ci.bookId === id ? { ...ci, quantity: ci.quantity + 1 } : ci)
        : [...cart, { bookId: id, quantity: 1 }];
      saveCartToStorage(userId, newCart);
      console.log('корзина после добавления товара:', { userId, cart: newCart });
      if (typeof onCartChange === 'function') {
        try { onCartChange(newCart); } catch {}
      }

      return updated;
    });
  };

  const removeFromCart = (id) => {
    setData(prev => {
      const updated = prev.map(item =>
        item.id === id
          ? {
              ...item,
              addedAmount: Math.max(item.addedAmount - 1, 0),
              addedToCart: item.addedAmount - 1 > 0
            }
          : item
      );

      const userId = getCurrentUserId();
      const cart = getCartFromStorage(userId);
      const exists = cart.find(ci => ci.bookId === id);
      let newCart;
      if (!exists) {
        newCart = cart;
      } else if (exists.quantity <= 1) {
        newCart = cart.filter(ci => ci.bookId !== id);
      } else {
        newCart = cart.map(ci => ci.bookId === id ? { ...ci, quantity: ci.quantity - 1 } : ci);
      }
      saveCartToStorage(userId, newCart);
      console.log('корзина после удаления товара:', { userId, cart: newCart });
      if (typeof onCartChange === 'function') {
        try { onCartChange(newCart); } catch {}
      }

      return updated;
    });
  };

  const becomeFavorite = (id) => {
    setData(prev => prev.map(item =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  };

  const filteredData = typeof term === 'function' ? data.filter(term) : data;

  return (
    <div>
      <u><header className="head">{head}</header></u>
      <div className="cards">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <CardItem
              key={item.id}
              item={item}
              becomeFavorite={becomeFavorite}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              changePrice={route === "cart"}
            />
          ))
        ) : (
          <h3 className='find'>
            Нет книг.
          </h3>
        )}
      </div>
    </div>
  );
};

export default Card;

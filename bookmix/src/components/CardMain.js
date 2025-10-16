import CardItem from './CardItem.js';
import { addToCartStorage, removeFromCartStorage } from '../utils/cartUtils.js';
import { toggleFavoriteStorage } from '../utils/favoriteUtils.js';
import { useBooksData } from '../utils/booksUtils.js';

const Card = ({ head, term, route, onCartChange }) => {
  const { data, setData } = useBooksData();

  const addToCart = (id) => {
    const newCart = addToCartStorage(id);
    setData(prev => prev.map(item =>
      item.id === id
        ? { ...item, addedToCart: true, addedAmount: item.addedAmount + 1 }
        : item
    ));
    if (typeof onCartChange === 'function') onCartChange(newCart);
  };

  const removeFromCart = (id) => {
    const newCart = removeFromCartStorage(id);
    setData(prev => prev.map(item =>
      item.id === id
        ? { ...item, addedAmount: Math.max(item.addedAmount - 1, 0), addedToCart: item.addedAmount - 1 > 0 }
        : item
    ));
    if (typeof onCartChange === 'function') onCartChange(newCart);
  };

  const becomeFavorite = (id) => {
    const result = toggleFavoriteStorage(id);
    if (!result) {
      alert('Войдите в систему, чтобы добавить книгу в избранное');
      return;
    }

    setData(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isFavorite: result.isFavorite } : item
      )
    );
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

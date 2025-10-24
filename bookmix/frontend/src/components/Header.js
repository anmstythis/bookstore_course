import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/userUtils.js';
import { getCartFromStorage } from '../utils/cartUtils.js';

const Header = ({ title, description }) => {
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const user = getCurrentUser();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCartNotEmpty, setIsCartNotEmpty] = useState(getCartFromStorage().length > 0);

  const handleButtonClick = () => navigate('/cart');

  useEffect(() => {
    const handleStorageChange = () => {
      const cart = getCartFromStorage();
      setIsCartNotEmpty(cart.length > 0);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    setIsAdminOpen(false); 
  };

  const toggleAdminMenu = () => {
    setIsAdminOpen((prev) => !prev);
  };

  const handleNavigate = (path) => {
    setIsMenuOpen(false);
    setIsAdminOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    setIsAdminOpen(false);
    localStorage.removeItem('user');
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
        setIsAdminOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div>
      <div className="mainpage">
        <div className="menuWrapper" ref={menuRef}>
          <button
            className="menuButton"
            onClick={toggleMenu}
            aria-haspopup="true"
            aria-expanded={isMenuOpen}
          >
            ⚙
          </button>

          {isMenuOpen && (
            <div className="menuDropdown" role="menu">
              <button
                className="menuItem"
                onClick={() => handleNavigate('/account')}
                role="menuitem"
              >
                Учетная запись
              </button>

              <button
                className="menuItem"
                onClick={() =>
                  handleNavigate(user.role_id === 1 ? '/reports' : '/orders')
                }
                role="menuitem"
              >
                {user.role_id === 1 ? 'Отчёты' : 'Заказы'}
              </button>

              {user.role_id === 1 && (
                <div className="submenuWrapper">
                  <button
                    className="menuItem submenuToggle"
                    onClick={toggleAdminMenu}
                    aria-expanded={isAdminOpen}
                  >
                    Панель администратора {isAdminOpen ? '▲' : '▼'}
                  </button>

                  {isAdminOpen && (
                    <div className="submenuDropdown" role="menu">
                      <button
                        className="menuItem"
                        onClick={() => handleNavigate('/products')}
                        role="menuitem"
                      >
                        Управление товарами
                      </button>
                      <button
                        className="menuItem"
                        onClick={() => handleNavigate('/orders-manage')}
                        role="menuitem"
                      >
                        Управление заказами
                      </button>
                      <button
                        className="menuItem"
                        onClick={() => handleNavigate('/all-accounts')}
                        role="menuitem"
                      >
                        Управление аккаунтами
                      </button>
                      <button
                        className="menuItem"
                        onClick={() => handleNavigate('/audit')}
                        role="menuitem"
                      >
                        Журнал аудита
                      </button>
                      <button
                        className="menuItem"
                        onClick={() => handleNavigate('/backup-db')}
                        role="menuitem"
                      >
                        Создание резервной копии
                      </button>
                    </div>
                  )}
                </div>
              )}

              <button
                className="menuItem menuItemDanger"
                onClick={handleLogout}
                role="menuitem"
              >
                Выйти
              </button>
            </div>
          )}
        </div>

        <header className="welcome">{title}</header>
        <button
          className={isCartNotEmpty ? 'cartFull' : 'cartEmpty'}
          onClick={handleButtonClick}
        >
          🛒
        </button>
      </div>

      <h2 className="find">{description}</h2>
    </div>
  );
};

export default Header;

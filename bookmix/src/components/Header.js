import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/userUtils.js'
import { getCartFromStorage } from '../utils/cartUtils.js'

const Header = ({title, description}) =>
{
    const navigate = useNavigate();
    const menuRef = useRef(null);

    const user = getCurrentUser();

    const handleButtonClick = () => {
        navigate("/cart");
    };

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartNotEmpty, setIsCartNotEmpty] = useState(getCartFromStorage().length > 0);

    useEffect(() => {
        const handleStorageChange = () => {
        const cart = getCartFromStorage();
        setIsCartNotEmpty(cart.length > 0);
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    const handleNavigateAccount = () => {
        setIsMenuOpen(false);
        navigate('/account');
    };

    const handleNavigateReports = () => {
        setIsMenuOpen(false);
        navigate('/reports');
    };

     const handleNavigateProducts = () => {
        setIsMenuOpen(false);
        navigate('/products');
    };

    const handleNavigateOrders = () => {
        setIsMenuOpen(false);
        navigate('/orders');
    }

    const handleLogout = () => {
        setIsMenuOpen(false);
        try {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
        } catch (e) {
            
        }
        navigate('/');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return(
        <div>
            <div className="mainpage">
                <div className="menuWrapper" ref={menuRef}>
                    <button className="menuButton" onClick={toggleMenu} aria-haspopup="true" aria-expanded={isMenuOpen}>⚙</button>
                    {isMenuOpen && (
                        <div className="menuDropdown" role="menu">
                            <button className="menuItem" onClick={handleNavigateAccount} role="menuitem">Учетная запись</button>
                            <button className="menuItem" onClick={user.role_id === 1 ? handleNavigateReports : handleNavigateOrders} 
                                role="menuitem">{user.role_id === 1 ? 'Отчёты' : 'Заказы'}</button>
                            {user.role_id === 1 && (<button className="menuItem" onClick={handleNavigateProducts} role="menuitem">Управление товарами</button>)}
                            <button className="menuItem menuItemDanger" onClick={handleLogout} role="menuitem">Выйти</button>
                        </div>
                    )}
                </div>
                <header className="welcome">
                {title}
                </header>
                <button className={isCartNotEmpty ? "cartFull" : "cartEmpty"} onClick={() => handleButtonClick()}>🛒</button>
            </div>
            <h2 className="find">{description}</h2>
        </div>

    )
    
}


export default Header
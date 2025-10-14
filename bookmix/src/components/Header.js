import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = ({title, description}) =>
{
    const navigate = useNavigate();
    const menuRef = useRef(null);

    const handleButtonClick = () => {
        navigate("/cart");
    };

    const [data, setData] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isCartNotEmpty = data.some(item => item.addedToCart === true);

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    const handleNavigateAccount = () => {
        setIsMenuOpen(false);
        navigate('/account');
    };

    const handleNavigateSettings = () => {
        setIsMenuOpen(false);
        navigate('/settings');
    };

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
                            <button className="menuItem" onClick={handleNavigateSettings} role="menuitem">Настройки</button>
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
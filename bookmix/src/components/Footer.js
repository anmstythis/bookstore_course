import React from "react";
import {Link} from "react-router-dom";

class Footer extends React.Component
{
    render()
    {
        return(
            <div>
                <hr/>
                <footer className="divFoot">
                    <Link className="foot2" to="/">Главная</Link>
                    <Link className="foot2" to="/catalogue">Каталог</Link>
                    <Link className="foot2" to="/favorites">Избранное</Link>
                </footer>
            </div>
        )
    }
}

export default Footer;
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey && event.key === "1") {
        navigate("/");
      }

      if (event.altKey && event.key === "2") {
        navigate("/catalogue");
      }

      if (event.altKey && event.key === "3") {
        navigate("/favorites");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  return (
    <div>
      <hr />
      <footer className="divFoot">
        <Link className="foot2" to="/">Главная</Link>
        <Link className="foot2" to="/catalogue">Каталог</Link>
        <Link className="foot2" to="/favorites">Избранное</Link>
      </footer>
    </div>
  );
};

export default Footer;

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Principal.css";

import logo from "../assets/logo.jpg";

import hero1 from "../assets/hero1.jpg";
import hero2 from "../assets/hero2.jpg";
import hero3 from "../assets/hero3.jpg";

export default function Principal() {
  const navigate = useNavigate();

  const images = [hero1, hero2, hero3];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="principal-container">

      <header className="topbar">
        <img src={logo} alt="logo" className="logo" />

        <nav className="menu">
          <Link to="/">Inicio</Link>
          <Link to="/recursos">Recursos</Link>

          <div className="dropdown">
            <button className="dropbtn">Ciclos</button>
            <div className="dropdown-content">
              <Link to="/ciclo/ordinario">Ordinario</Link>
              <Link to="/ciclo/intensivo">Intensivo</Link>
            </div>
          </div>

          <Link to="/matricula">Matrícula en línea</Link>
          <Link to="/contacto">Contacto</Link>
        </nav>

        <button className="btn-aula">Aula Virtual</button>
      </header>

      <section
        className="hero"
        style={{ backgroundImage: `url(${images[current]})` }}
      >
        <div className="hero-content">
          <h1>Bienvenido a la Academia Pre</h1>
          <p>
            Cada día es una oportunidad para avanzar hacia tus objetivos.
            Confía en ti, trabaja con disciplina y sigue adelante.
          </p>

          <button className="btn-hero" onClick={() => navigate("/registro")}>
            Matricúlate Aquí
          </button>
        </div>
      </section>

    </div>
  );
}

import React from "react";
import "./Principal.css";
import logo from "../assets/logo.jpg";
import { useNavigate } from "react-router-dom"; // Importa useNavigate

export default function Principal() {
  const navigate = useNavigate(); // Inicializa el hook

  //Función para redirigir
  const irAMatricula = () => {
    navigate("/matricula");
  };

  return (
    <div className="principal-container">
      {/*NAVBAR */}
      <header className="navbar">
        <div className="logo">
          <img src={logo} alt="Logo Academia" />
          <h2>ACADEMIA</h2>
        </div>
        <nav className="nav-links">
          <a href="#">Inicio</a>
          <a href="#">Ciclos</a>
          <a href="#">Sedes</a>
          <a href="#">Docentes</a>
          <a href="#">Blog</a>
          <a href="#">Contacto</a>
        </nav>

        {/*Botón que redirige */}
        <button className="btn-matricula" onClick={irAMatricula}>
          Matricúlate en línea
        </button>
      </header>

      {/*SECCIÓN PRINCIPAL */}
      <main className="hero-section">
        <div className="hero-text">
          <h1>
            Prepárate para tu <span>futuro universitario</span>
          </h1>
          <p>
            Asegura tu ingreso a la universidad con nuestra metodología de
            enseñanza moderna, clases virtuales y docentes especializados.
          </p>
          <button className="btn-ingresar" onClick={irAMatricula}>
            ¡Empieza ahora!
          </button>
        </div>

        <div className="hero-image">
          <img
            src="https://i.ibb.co/d0GLx8C/estudiante-pitagoras.jpg"
            alt="Estudiante estudiando"
          />
        </div>
      </main>

      {/* 🔹 SECCIÓN DE INFORMACIÓN */}
      <section className="info-section">
        <h2>¿Por qué elegirnos?</h2>
        <div className="info-cards">
          <div className="card">
            <h3>Clases Virtuales</h3>
            <p>
              Accede desde cualquier parte del Perú con materiales actualizados
              y sesiones en vivo.
            </p>
          </div>
          <div className="card">
            <h3>🎯 Preparación Personalizada</h3>
            <p>
              Recibe asesorías y simulacros adaptados a tu ritmo de aprendizaje.
            </p>
          </div>
          <div className="card">
            <h3>🏆 Resultados Comprobados</h3>
            <p>
              Nuestros alumnos destacan cada año en los primeros puestos de
              admisión universitaria.
            </p>
          </div>
        </div>
      </section>

      {/* 🔹 FOOTER */}
      <footer className="footer">
        <p>© 2025 Academia Preuniversitaria. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

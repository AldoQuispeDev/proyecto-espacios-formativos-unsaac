import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import "./Principal.css";
import ModalidadSelectionModal from "../components/ModalidadSelectionModal";
import ConsultarEstadoModal from "../components/ConsultarEstadoModal";
import MatriculaRapidaModal from "../components/MatriculaRapidaModal";

export default function Principal() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [isModalidadModalOpen, setIsModalidadModalOpen] = useState(false);
  const [isConsultarEstadoOpen, setIsConsultarEstadoOpen] = useState(false);
  const [isAulaDropdownOpen, setIsAulaDropdownOpen] = useState(false);
  const [matriculaPendiente, setMatriculaPendiente] = useState(null);
  const [isMatriculaRapidaOpen, setIsMatriculaRapidaOpen] = useState(false);

  // Importación dinámica de imágenes para evitar errores de carga
  const [images, setImages] = useState([]);
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    // Cargar imágenes de forma segura
    const loadImages = async () => {
      try {
        const logoModule = await import("../assets/logo.jpg");
        const hero1Module = await import("../assets/hero1.jpg");
        const hero2Module = await import("../assets/hero2.jpg");
        const hero3Module = await import("../assets/hero3.jpg");
        
        setLogo(logoModule.default);
        setImages([hero1Module.default, hero2Module.default, hero3Module.default]);
      } catch (error) {
        console.error("Error al cargar imágenes:", error);
        // Continuar sin imágenes si hay error
      }
    };

    loadImages();
  }, []);

  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % images.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [images]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isAulaDropdownOpen && !event.target.closest('.dropdown-aula')) {
        setIsAulaDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isAulaDropdownOpen]);

  return (
    <div className="principal-container">
      <header className="topbar">
        {logo ? (
          <img src={logo} alt="logo" className="logo" />
        ) : (
          <div className="logo" style={{ color: 'white', fontWeight: 'bold' }}>ACADEMIA PRE</div>
        )}

        <nav className="menu">
          <Link to="/">Inicio</Link>
          <Link to="/recursos">Recursos</Link>

          <div className="dropdown">
            <button className="dropbtn" onClick={() => setIsModalidadModalOpen(true)}>
              Ciclos
            </button>
          </div>

          <Link to="/nosotros">Nosotros</Link>
          <Link to="/contacto">Contacto</Link>
        </nav>

        <div className="dropdown dropdown-aula">
          <button 
            className="btn-aula"
            onClick={() => setIsAulaDropdownOpen(!isAulaDropdownOpen)}
          >
            <Icon name="mortarboard" size="md" /> Aula Virtual
          </button>
          <div className={`dropdown-content dropdown-aula-content ${isAulaDropdownOpen ? 'show' : ''}`}>
            <button onClick={() => navigate("/login", { state: { selectedRole: "ESTUDIANTE" } })}>
              <span className="role-icon-small">
                <Icon name="mortarboard" size="sm" />
              </span>
              Estudiante
            </button>
            <button onClick={() => navigate("/login", { state: { selectedRole: "DOCENTE" } })}>
              <span className="role-icon-small">
                <Icon name="person-video3" size="sm" />
              </span>
              Docente
            </button>
            <button onClick={() => navigate("/login", { state: { selectedRole: "ADMIN" } })}>
              <span className="role-icon-small">
                <Icon name="person-badge" size="sm" />
              </span>
              Administrador
            </button>
          </div>
        </div>
      </header>

      <ModalidadSelectionModal
        isOpen={isModalidadModalOpen}
        onClose={() => setIsModalidadModalOpen(false)}
      />

      <ConsultarEstadoModal
        isOpen={isConsultarEstadoOpen}
        onClose={() => setIsConsultarEstadoOpen(false)}
        onContinueMatricula={(matricula) => {
          setMatriculaPendiente(matricula);
          setIsMatriculaRapidaOpen(true);
        }}
      />

      {matriculaPendiente && (
        <MatriculaRapidaModal
          isOpen={isMatriculaRapidaOpen}
          onClose={() => {
            setIsMatriculaRapidaOpen(false);
            setMatriculaPendiente(null);
          }}
          modalidad={matriculaPendiente.modalidad}
          matriculaPendiente={matriculaPendiente}
        />
      )}

      <section
        className="hero"
        style={{ 
          backgroundImage: images.length > 0 ? `url(${images[current]})` : 'none',
          backgroundColor: images.length === 0 ? '#830000' : 'transparent'
        }}
      >
        <div className="hero-content">
          <h1>Bienvenido a la Academia Pre</h1>
          <p>
            Cada día es una oportunidad para avanzar hacia tus objetivos.
            Confía en ti, trabaja con disciplina y sigue adelante.
          </p>

          <div className="hero-buttons">
            <button className="btn-hero btn-primary" onClick={() => setIsModalidadModalOpen(true)}>
              Matricúlate Aquí
            </button>
            <button className="btn-hero btn-secondary" onClick={() => setIsConsultarEstadoOpen(true)}>
              <Icon name="search" size="md" /> Consultar Estado de Matrícula
            </button>
          </div>
        </div>

        {/* Indicador de scroll */}
        <div className="scroll-indicator">
          <span>Desliza para conocernos</span>
          <div className="scroll-arrow">↓</div>
        </div>
      </section>

      {/* SECCIÓN NOSOTROS INTEGRADA */}
      <section className="nosotros-section-integrated">
        {/* MISIÓN Y VISIÓN */}
        <div className="mision-vision-section">
          <div className="container">
            <h2 className="section-title">Quiénes Somos</h2>
            <div className="row g-4">
              <div className="col-12 col-lg-6">
                <div className="card-mision-vision h-100">
                  <div className="card-icon">
                    <Icon name="bullseye" size="xl" title="Misión" />
                  </div>
                  <h3>Misión</h3>
                  <p>
                    Brindar educación preuniversitaria de calidad, formando estudiantes
                    con sólidos conocimientos académicos, valores éticos y habilidades
                    que les permitan ingresar exitosamente a la Universidad Nacional de
                    San Antonio Abad del Cusco y convertirse en profesionales íntegros
                    al servicio de la sociedad.
                  </p>
                </div>
              </div>

              <div className="col-12 col-lg-6">
                <div className="card-mision-vision h-100">
                  <div className="card-icon">
                    <Icon name="star-fill" size="xl" title="Visión" />
                  </div>
                  <h3>Visión</h3>
                  <p>
                    Ser la academia preuniversitaria líder en la región Cusco,
                    reconocida por su excelencia académica, innovación pedagógica y
                    alto índice de ingresantes a la UNSAAC, contribuyendo al desarrollo
                    educativo y social de nuestra región.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LOGROS */}
        <div className="logros-section">
          <div className="container">
            <h2 className="section-title text-white">Nuestros Logros</h2>
            <div className="row g-4">
              <div className="col-12 col-md-6 col-lg-3">
                <div className="logro-card h-100">
                  <div className="logro-icono">
                    <Icon name="trophy-fill" size="xl" title="Ingresantes" />
                  </div>
                  <h3>95% de Ingresantes</h3>
                  <p>Tasa de ingreso a la UNSAAC en los últimos 5 años</p>
                </div>
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <div className="logro-card h-100">
                  <div className="logro-icono">
                    <Icon name="mortarboard" size="xl" title="Estudiantes" />
                  </div>
                  <h3>+5000 Estudiantes</h3>
                  <p>Preparados exitosamente desde nuestra fundación</p>
                </div>
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <div className="logro-card h-100">
                  <div className="logro-icono">
                    <Icon name="book" size="xl" title="Experiencia" />
                  </div>
                  <h3>15 Años de Experiencia</h3>
                  <p>Formando a los futuros profesionales del Cusco</p>
                </div>
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <div className="logro-card h-100">
                  <div className="logro-icono">
                    <Icon name="star-fill" size="xl" title="Docentes" />
                  </div>
                  <h3>Docentes Calificados</h3>
                  <p>Equipo de profesionales especializados por área</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* VALORES */}
        <div className="valores-section">
          <div className="container">
            <h2 className="section-title">Nuestros Valores</h2>
            <div className="row g-4">
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="valor-item h-100 d-flex flex-column align-items-center">
                  <span className="valor-icono">
                    <Icon name="award" size="xl" title="Excelencia" />
                  </span>
                  <h4>Excelencia</h4>
                  <p className="text-center mb-0">Compromiso con la calidad educativa</p>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="valor-item h-100 d-flex flex-column align-items-center">
                  <span className="valor-icono">
                    <Icon name="hand-thumbs-up" size="xl" title="Integridad" />
                  </span>
                  <h4>Integridad</h4>
                  <p className="text-center mb-0">Honestidad y transparencia en todo momento</p>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="valor-item h-100 d-flex flex-column align-items-center">
                  <span className="valor-icono">
                    <Icon name="mortarboard" size="xl" title="Responsabilidad" />
                  </span>
                  <h4>Responsabilidad</h4>
                  <p className="text-center mb-0">Compromiso con el aprendizaje de nuestros estudiantes</p>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="valor-item h-100 d-flex flex-column align-items-center">
                  <span className="valor-icono">
                    <Icon name="lightbulb" size="xl" title="Innovación" />
                  </span>
                  <h4>Innovación</h4>
                  <p className="text-center mb-0">Adaptación constante a nuevas metodologías</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CALL TO ACTION */}
        <div className="cta-section">
          <div className="container text-center">
            <h2 className="mb-3">¿Listo para alcanzar tus metas?</h2>
            <p className="mb-4">Únete a la familia de la Academia Pre UNSAAC</p>
            <button 
              onClick={() => setIsModalidadModalOpen(true)} 
              className="btn btn-light btn-lg px-5 py-3 btn-cta"
            >
              Matricúlate Ahora
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

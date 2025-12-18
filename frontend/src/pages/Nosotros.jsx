// src/pages/Nosotros.jsx

import { useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import "./Nosotros.css";

export default function Nosotros() {
  const navigate = useNavigate();

  const directores = [
    {
      nombre: "Dr. Carlos Mendoza Quispe",
      cargo: "Director General",
      foto: "person-badge",
      descripcion: "Docente con 20 años de experiencia en preparación preuniversitaria",
    },
    {
      nombre: "Mg. María Elena Huamán",
      cargo: "Directora Académica",
      foto: "person-video3",
      descripcion: "Especialista en metodologías de enseñanza y evaluación",
    },
    {
      nombre: "Lic. Roberto Flores Ccama",
      cargo: "Coordinador de Ciclos",
      foto: "person-video3",
      descripcion: "Coordinador de programas ordinarios e intensivos",
    },
  ];

  const logros = [
    {
      icono: "trophy-fill",
      titulo: "95% de Ingresantes",
      descripcion: "Tasa de ingreso a la UNSAAC en los últimos 5 años",
    },
    {
      icono: "mortarboard",
      titulo: "+5000 Estudiantes",
      descripcion: "Preparados exitosamente desde nuestra fundación",
    },
    {
      icono: "book",
      titulo: "15 Años de Experiencia",
      descripcion: "Formando a los futuros profesionales del Cusco",
    },
    {
      icono: "star-fill",
      titulo: "Docentes Calificados",
      descripcion: "Equipo de profesionales especializados por área",
    },
  ];

  return (
    <div className="nosotros-container">
      {/* HEADER CON NAVEGACIÓN */}
      <header className="nosotros-header">
        <button onClick={() => navigate("/")} className="btn-volver">
          ← Volver al Inicio
        </button>
        <h1>Nosotros</h1>
      </header>

      {/* HERO SECTION */}
      <section className="nosotros-hero">
        <div className="hero-overlay">
          <h2>Academia Pre UNSAAC</h2>
          <p>Formando a los futuros profesionales del Cusco</p>
        </div>
      </section>

      {/* MISIÓN Y VISIÓN */}
      <section className="mision-vision-section">
        <div className="mision-vision-grid">
          <div className="card-mision-vision">
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

          <div className="card-mision-vision">
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
      </section>

      {/* HISTORIA */}
      <section className="historia-section">
        <h2 className="section-title">Nuestra Historia</h2>
        <div className="historia-content">
          <div className="historia-text">
            <p>
              La <strong>Academia Pre UNSAAC</strong> fue fundada en el año 2010
              con el objetivo de brindar preparación académica de calidad a los
              jóvenes que aspiran ingresar a la Universidad Nacional de San
              Antonio Abad del Cusco.
            </p>
            <p>
              Durante más de <strong>15 años</strong>, hemos consolidado nuestra
              metodología de enseñanza, adaptándonos a las necesidades de cada
              generación de estudiantes y a los cambios en los exámenes de
              admisión.
            </p>
            <p>
              Nuestro compromiso con la excelencia académica nos ha permitido
              formar a más de <strong>5,000 estudiantes</strong>, logrando que el
              95% de nuestros alumnos ingresen exitosamente a la carrera de su
              elección en la UNSAAC.
            </p>
            <p>
              Hoy en día, contamos con modernas instalaciones, un equipo de
              docentes altamente calificados y una plataforma virtual que
              complementa la enseñanza presencial, garantizando una formación
              integral y competitiva.
            </p>
          </div>
          <div className="historia-timeline">
            <div className="timeline-item">
              <div className="timeline-year">2010</div>
              <div className="timeline-desc">Fundación de la academia</div>
            </div>
            <div className="timeline-item">
              <div className="timeline-year">2015</div>
              <div className="timeline-desc">Expansión de instalaciones</div>
            </div>
            <div className="timeline-item">
              <div className="timeline-year">2020</div>
              <div className="timeline-desc">Implementación de aula virtual</div>
            </div>
            <div className="timeline-item">
              <div className="timeline-year">2025</div>
              <div className="timeline-desc">Líderes en preparación preuniversitaria</div>
            </div>
          </div>
        </div>
      </section>

      {/* LOGROS - CON BOOTSTRAP */}
      <section className="logros-section">
        <div className="container">
          <h2 className="section-title">Nuestros Logros</h2>
          <div className="row g-4">
            {logros.map((logro, index) => (
              <div key={index} className="col-12 col-md-6 col-lg-3">
                <div className="logro-card h-100">
                  <div className="logro-icono">
                    <Icon name={logro.icono} size="xl" title={logro.titulo} />
                  </div>
                  <h3>{logro.titulo}</h3>
                  <p>{logro.descripcion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIRECTORES */}
      <section className="directores-section">
        <h2 className="section-title">Nuestro Equipo Directivo</h2>
        <div className="directores-grid">
          {directores.map((director, index) => (
            <div key={index} className="director-card">
              <div className="director-foto">
                <Icon name={director.foto} size="xl" title={director.nombre} />
              </div>
              <h3>{director.nombre}</h3>
              <p className="director-cargo">{director.cargo}</p>
              <p className="director-descripcion">{director.descripcion}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VALORES - CON BOOTSTRAP */}
      <section className="valores-section">
        <div className="container">
          <h2 className="section-title">Nuestros Valores</h2>
          <div className="row g-4">
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="valor-item h-100 d-flex flex-column align-items-center">
                <span className="valor-icono">
                  <Icon name="award" size="xl" title="Excelencia" />
                </span>
                <h4>Excelencia</h4>
                <p className="text-center">Compromiso con la calidad educativa</p>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="valor-item h-100 d-flex flex-column align-items-center">
                <span className="valor-icono">
                  <Icon name="hand-thumbs-up" size="xl" title="Integridad" />
                </span>
                <h4>Integridad</h4>
                <p className="text-center">Honestidad y transparencia en todo momento</p>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="valor-item h-100 d-flex flex-column align-items-center">
                <span className="valor-icono">
                  <Icon name="mortarboard" size="xl" title="Responsabilidad" />
                </span>
                <h4>Responsabilidad</h4>
                <p className="text-center">Compromiso con el aprendizaje de nuestros estudiantes</p>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="valor-item h-100 d-flex flex-column align-items-center">
                <span className="valor-icono">
                  <Icon name="lightbulb" size="xl" title="Innovación" />
                </span>
                <h4>Innovación</h4>
                <p className="text-center">Adaptación constante a nuevas metodologías</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION - CON BOOTSTRAP */}
      <section className="cta-section">
        <div className="container text-center">
          <h2 className="mb-3">¿Listo para alcanzar tus metas?</h2>
          <p className="mb-4">Únete a la familia de la Academia Pre UNSAAC</p>
          <button onClick={() => navigate("/")} className="btn btn-light btn-lg px-5 py-3 btn-cta">
            Matricúlate Ahora
          </button>
        </div>
      </section>
    </div>
  );
}

// src/pages/docente/DashboardDocente.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DocenteLayout from "../../components/DocenteLayout";
import StatCard from "../../components/StatCard";
import ModuleCard from "../../components/ModuleCard";
import { getDashboardDocente } from "../../api/docente";
import "./DashboardDocente.css";

const MODULOS = [
  {
    id: 1,
    title: "Mis Horarios",
    description: "Consulta tus horarios de clases, aulas asignadas y calendario semanal.",
    path: "/docente/horarios",
    icon: "📅",
    color: "blue",
  },
  {
    id: 2,
    title: "Mis Estudiantes",
    description: "Visualiza la lista de estudiantes matriculados en tus grupos.",
    path: "/docente/estudiantes",
    icon: "🎓",
    color: "green",
  },
  {
    id: 3,
    title: "Mi Perfil",
    description: "Revisa y actualiza tu información personal y académica.",
    path: "/docente/perfil",
    icon: "👤",
    color: "purple",
  },
];

export default function DashboardDocente() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await getDashboardDocente();
      setData(res.data);
      setError(null);
    } catch (err) {
      console.error("Error al cargar dashboard:", err);
      setError("No se pudo cargar la información del dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DocenteLayout title="Dashboard del Docente">
      {/* BIENVENIDA */}
      <div className="dashboard-welcome mb-4">
        <h2 className="dashboard-welcome-title mb-3">
          ¡Bienvenido, {data?.docente?.nombre || "Profesor"}! 👋
        </h2>
        <p className="dashboard-welcome-text text-muted">
          Aquí encontrarás un resumen de tu actividad docente y accesos rápidos a tus funciones principales.
        </p>
      </div>

      {/* INFORMACIÓN DEL DOCENTE */}
      {loading ? (
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Cargando información...</p>
        </div>
      ) : error ? (
        <div className="dashboard-error">
          <p>⚠️ {error}</p>
          <button onClick={fetchDashboard} className="btn-retry">
            Reintentar
          </button>
        </div>
      ) : data ? (
        <>
          {/* PERFIL DEL DOCENTE */}
          <section className="dashboard-section mb-5">
            <h3 className="dashboard-section-title mb-4">👨‍🏫 Mi Información</h3>
            <div className="docente-info-card">
              <div className="docente-info-avatar">👨‍🏫</div>
              <div className="docente-info-details">
                <h4 className="docente-info-name">{data.docente.nombre}</h4>
                <p className="docente-info-field">
                  <span className="info-label">📚 Especialidad:</span>
                  <span className="info-value">{data.docente.especialidad || "No especificada"}</span>
                </p>
                <p className="docente-info-field">
                  <span className="info-label">🎓 Título:</span>
                  <span className="info-value">{data.docente.titulo || "No especificado"}</span>
                </p>
              </div>
            </div>
          </section>

          {/* ESTADÍSTICAS */}
          <section className="dashboard-section mb-5">
            <h3 className="dashboard-section-title mb-4">📊 Resumen de Actividad</h3>
            <div className="row g-4">
              <div className="col-12 col-sm-6 col-lg-4">
                <StatCard
                  icon="📅"
                  title="Horarios Asignados"
                  value={data.estadisticas.totalHorarios}
                  subtitle="Clases totales"
                  color="blue"
                />
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                <StatCard
                  icon="🎓"
                  title="Estudiantes"
                  value={data.estadisticas.totalEstudiantes}
                  subtitle="Alumnos en tus grupos"
                  color="green"
                />
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                <StatCard
                  icon="📆"
                  title="Clases Hoy"
                  value={data.estadisticas.horariosHoy}
                  subtitle="Sesiones programadas"
                  color="orange"
                />
              </div>
            </div>
          </section>
        </>
      ) : null}

      {/* MÓDULOS DE ACCESO RÁPIDO */}
      <section className="dashboard-section mb-5">
        <h3 className="dashboard-section-title mb-4">🚀 Accesos Rápidos</h3>
        <div className="row g-4">
          {MODULOS.map((modulo) => (
            <div key={modulo.id} className="col-12 col-md-6 col-lg-4">
              <ModuleCard
                icon={modulo.icon}
                title={modulo.title}
                description={modulo.description}
                color={modulo.color}
                onClick={() => navigate(modulo.path)}
              />
            </div>
          ))}
        </div>
      </section>
    </DocenteLayout>
  );
}

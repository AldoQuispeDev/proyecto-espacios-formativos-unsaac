import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebarLayout from "../../components/AdminSidebarLayout";
import StatCard from "../../components/StatCard";
import ModuleCard from "../../components/ModuleCard";
import Icon from "../../components/Icon";
import { getEstadisticas } from "../../api/dashboard";
import "./DashboardAdmin.css";

const MODULOS = [
  {
    id: 1,
    title: "Validación de Matrículas",
    description: "Revisa, aprueba o rechaza los comprobantes de pago de los nuevos estudiantes.",
    path: "/admin/validarMatricula",
    icon: "file-text",
    color: "orange",
  },
  {
    id: 2,
    title: "Gestión de Estudiantes",
    description: "Visualiza, edita y administra los perfiles de todos los alumnos registrados.",
    path: "/admin/estudiantes",
    icon: "mortarboard",
    color: "blue",
  },
  {
    id: 3,
    title: "Gestión de Docentes",
    description: "Crea, edita y desactiva las fichas de los profesores y personal administrativo.",
    path: "/admin/docentes",
    icon: "person-video3",
    color: "green",
  },
  {
    id: 4,
    title: "Gestión de Horarios",
    description: "Administra los horarios de clases, asigna docentes, aulas y gestiona el calendario académico.",
    path: "/admin/horarios",
    icon: "calendar3",
    color: "purple",
  },
  {
    id: 5,
    title: "Catálogos Académicos",
    description: "Administra las Modalidades, Grupos, Carreras y Asignaturas.",
    path: "/admin/catalogos",
    icon: "book",
    color: "orange",
  },
];

export default function DashboardAdmin() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEstadisticas();
  }, []);

  const fetchEstadisticas = async () => {
    try {
      setLoading(true);
      const res = await getEstadisticas();
      setStats(res.data);
      setError(null);
    } catch (err) {
      console.error("Error al cargar estadísticas:", err);
      setError("No se pudieron cargar las estadísticas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminSidebarLayout title="Dashboard del Administrador">
      {/* BIENVENIDA - CON BOOTSTRAP */}
      <div className="dashboard-welcome mb-4">
        <h2 className="dashboard-welcome-title mb-3">
          ¡Bienvenido al Panel de Administración! <Icon name="hand-wave" size="lg" />
        </h2>
        <p className="dashboard-welcome-text text-muted">
          Aquí encontrarás un resumen completo de las métricas clave del sistema y accesos rápidos a todas las funciones de gestión.
        </p>
      </div>

      {/* ESTADÍSTICAS */}
      {loading ? (
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Cargando estadísticas...</p>
        </div>
      ) : error ? (
        <div className="dashboard-error">
          <p><Icon name="exclamation-triangle" size="md" /> {error}</p>
          <button onClick={fetchEstadisticas} className="btn-retry">
            Reintentar
          </button>
        </div>
      ) : stats ? (
        <>
          {/* SECCIÓN: USUARIOS - CON BOOTSTRAP GRID */}
          <section className="dashboard-section mb-5">
            <h3 className="dashboard-section-title mb-4"><Icon name="people" size="md" /> Usuarios del Sistema</h3>
            <div className="row g-4">
              <div className="col-12 col-sm-6 col-xl-3">
                <StatCard
                  icon="mortarboard"
                  title="Estudiantes"
                  value={stats.usuarios.estudiantes}
                  subtitle="Alumnos activos"
                  color="blue"
                />
              </div>
              <div className="col-12 col-sm-6 col-xl-3">
                <StatCard
                  icon="person-video3"
                  title="Docentes"
                  value={stats.usuarios.docentes}
                  subtitle="Profesores activos"
                  color="green"
                />
              </div>
              <div className="col-12 col-sm-6 col-xl-3">
                <StatCard
                  icon="person-badge"
                  title="Administradores"
                  value={stats.usuarios.admins}
                  subtitle="Personal administrativo"
                  color="purple"
                />
              </div>
              <div className="col-12 col-sm-6 col-xl-3">
                <StatCard
                  icon="person"
                  title="Total Usuarios"
                  value={stats.usuarios.total}
                  subtitle="Usuarios registrados"
                  color="orange"
                />
              </div>
            </div>
          </section>

          {/* SECCIÓN: MATRÍCULAS - CON BOOTSTRAP GRID */}
          <section className="dashboard-section mb-5">
            <h3 className="dashboard-section-title mb-4"><Icon name="file-text" size="md" /> Estado de Matrículas</h3>
            <div className="row g-4">
              <div className="col-12 col-sm-6 col-xl-3">
                <StatCard
                  icon="hourglass-split"
                  title="Pendientes"
                  value={stats.matriculas.pendientes}
                  subtitle="Esperando validación"
                  color="yellow"
                />
              </div>
              <div className="col-12 col-sm-6 col-xl-3">
                <StatCard
                  icon="check-circle-fill"
                  title="Aprobadas"
                  value={stats.matriculas.aprobadas}
                  subtitle="Matrículas confirmadas"
                  color="green"
                />
              </div>
              <div className="col-12 col-sm-6 col-xl-3">
                <StatCard
                  icon="x-circle-fill"
                  title="Rechazadas"
                  value={stats.matriculas.rechazadas}
                  subtitle="Matrículas denegadas"
                  color="red"
                />
              </div>
              <div className="col-12 col-sm-6 col-xl-3">
                <StatCard
                  icon="bar-chart"
                  title="Total"
                  value={stats.matriculas.total}
                  subtitle="Todas las matrículas"
                  color="blue"
                />
              </div>
            </div>
          </section>

          {/* SECCIÓN: CATÁLOGOS - CON BOOTSTRAP GRID */}
          <section className="dashboard-section mb-5">
            <h3 className="dashboard-section-title mb-4"><Icon name="book" size="md" /> Catálogos Académicos</h3>
            <div className="row g-3">
              <div className="col-6 col-md-3">
                <StatCard
                  icon="building"
                  title="Grupos"
                  value={stats.catalogos.grupos}
                  color="purple"
                />
              </div>
              <div className="col-6 col-md-3">
                <StatCard
                  icon="bullseye"
                  title="Carreras"
                  value={stats.catalogos.carreras}
                  color="blue"
                />
              </div>
              <div className="col-6 col-md-3">
                <StatCard
                  icon="book-half"
                  title="Asignaturas"
                  value={stats.catalogos.asignaturas}
                  color="green"
                />
              </div>
              <div className="col-6 col-md-3">
                <StatCard
                  icon="mortarboard"
                  title="Modalidades"
                  value={stats.catalogos.modalidades}
                  color="orange"
                />
              </div>
            </div>
          </section>

          {/* SECCIÓN: ACTIVIDAD RECIENTE */}
          {stats.recientes.estudiantes.length > 0 && (
            <section className="dashboard-section">
              <h3 className="dashboard-section-title"><Icon name="clock-history" size="md" /> Últimos Estudiantes Registrados</h3>
              <div className="recent-list">
                {stats.recientes.estudiantes.map((est) => (
                  <div key={est.id} className="recent-item">
                    <div className="recent-item-icon">
                      <Icon name="mortarboard" size="lg" />
                    </div>
                    <div className="recent-item-content">
                      <p className="recent-item-name">
                        {est.usuario.nombre} {est.usuario.apellidoPaterno} {est.usuario.apellidoMaterno}
                      </p>
                      <p className="recent-item-detail">{est.usuario.correo}</p>
                    </div>
                    <div className="recent-item-date">
                      {new Date(est.usuario.creadoEn).toLocaleDateString("es-ES")}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      ) : null}

      {/* MÓDULOS DE GESTIÓN - CON BOOTSTRAP GRID */}
      <section className="dashboard-section mb-5">
        <h3 className="dashboard-section-title mb-4"><Icon name="rocket-takeoff" size="md" /> Accesos Rápidos</h3>
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
    </AdminSidebarLayout>
  );
}

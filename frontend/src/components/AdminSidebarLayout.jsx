// src/components/AdminSidebarLayout.jsx
import "./AdminSidebarLayout.css";
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';

export default function AdminSidebarLayout({ title, children }) {
  return (
    <div className="admin-sidebar-layout">
      {/* HEADER DINÁMICO CON NAVEGACIÓN */}
      <AdminHeader />

      {/* CONTENEDOR PRINCIPAL */}
      <div className="admin-sidebar-container">
        {/* CONTENIDO PRINCIPAL */}
        <main className="admin-sidebar-main">
          <h1 className="admin-sidebar-title">{title}</h1>
          {children}
        </main>
      </div>

      {/* FOOTER DINÁMICO */}
      <AdminFooter />
    </div>
  );
}

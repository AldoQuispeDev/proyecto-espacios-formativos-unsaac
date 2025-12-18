// src/components/DocenteLayout.jsx

import DocenteHeader from './DocenteHeader';
import AdminFooter from './AdminFooter';
import './DocenteLayout.css';

export default function DocenteLayout({ title, children }) {
  return (
    <div className="docente-layout">
      <DocenteHeader />
      
      <div className="docente-container">
        <main className="docente-main">
          <h1 className="docente-title">{title}</h1>
          {children}
        </main>
      </div>

      <AdminFooter />
    </div>
  );
}

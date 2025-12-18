import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import { AuthContext } from '../context/AuthContext';

// Mock AuthContext
const mockAuthContext = {
  usuario: {
    nombre: 'Juan',
    apellidoPaterno: 'Pérez',
    correo: 'juan@example.com'
  },
  cerrarSesion: vi.fn()
};

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={mockAuthContext}>
        {component}
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('AdminHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza todos los iconos de navegación', () => {
    renderWithRouter(<AdminHeader />);
    
    // Verificar que los iconos de navegación están presentes
    // Buscamos por los nombres de los enlaces de navegación
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Validar Matrículas')).toBeInTheDocument();
    expect(screen.getByText('Gestión de Docentes')).toBeInTheDocument();
    expect(screen.getByText('Gestión de Estudiantes')).toBeInTheDocument();
    expect(screen.getByText('Gestión de Horarios')).toBeInTheDocument();
    expect(screen.getByText('Catálogos Académicos')).toBeInTheDocument();
  });

  it('renderiza el icono de notificaciones', () => {
    renderWithRouter(<AdminHeader />);
    
    // Verificar que el botón de notificaciones existe
    const notificationButtons = screen.getAllByRole('button');
    const notificationButton = notificationButtons.find(btn => 
      btn.className.includes('btn-notifications')
    );
    expect(notificationButton).toBeInTheDocument();
    
    // Verificar que tiene el badge de notificaciones
    const badge = screen.getByText('3');
    expect(badge).toBeInTheDocument();
  });

  it('renderiza el menú de usuario con información', () => {
    renderWithRouter(<AdminHeader />);
    
    // Verificar que el nombre del usuario se muestra
    expect(screen.getByText('Juan')).toBeInTheDocument();
    expect(screen.getByText('Administrador')).toBeInTheDocument();
  });

  it('renderiza el logo de la academia', () => {
    renderWithRouter(<AdminHeader />);
    
    // Verificar que el título de la academia está presente
    expect(screen.getByText('Academia Pre UNSAAC')).toBeInTheDocument();
    expect(screen.getByText('Panel de Admin')).toBeInTheDocument();
  });
});

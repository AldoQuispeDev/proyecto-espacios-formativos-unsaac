import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DashboardAdmin from './DashboardAdmin';
import * as dashboardApi from '../../api/dashboard';

// Mock the API
vi.mock('../../api/dashboard');

// Mock the child components
vi.mock('../../components/AdminSidebarLayout', () => ({
  default: ({ children, title }) => (
    <div data-testid="admin-sidebar-layout">
      <h1>{title}</h1>
      {children}
    </div>
  ),
}));

vi.mock('../../components/StatCard', () => ({
  default: ({ icon, title, value, subtitle, color }) => (
    <div data-testid="stat-card" data-icon={icon} data-color={color}>
      <span>{title}</span>
      <span>{value}</span>
      {subtitle && <span>{subtitle}</span>}
    </div>
  ),
}));

vi.mock('../../components/ModuleCard', () => ({
  default: ({ icon, title, description, color, onClick }) => (
    <div data-testid="module-card" data-icon={icon} data-color={color} onClick={onClick}>
      <span>{title}</span>
      <span>{description}</span>
    </div>
  ),
}));

const mockStats = {
  usuarios: {
    estudiantes: 150,
    docentes: 25,
    admins: 5,
    total: 180,
  },
  matriculas: {
    pendientes: 10,
    aprobadas: 120,
    rechazadas: 5,
    total: 135,
  },
  catalogos: {
    grupos: 8,
    carreras: 12,
    asignaturas: 45,
    modalidades: 3,
  },
  recientes: {
    estudiantes: [
      {
        id: 1,
        usuario: {
          nombre: 'Juan',
          apellidoPaterno: 'Pérez',
          apellidoMaterno: 'García',
          correo: 'juan@example.com',
          creadoEn: '2024-01-15T10:00:00Z',
        },
      },
    ],
  },
};

describe('DashboardAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render StatCards with correct Bootstrap icons for usuarios section', async () => {
    dashboardApi.getEstadisticas.mockResolvedValue({ data: mockStats });

    render(
      <BrowserRouter>
        <DashboardAdmin />
      </BrowserRouter>
    );

    await waitFor(() => {
      const statCards = screen.getAllByTestId('stat-card');
      
      // Find the usuarios section cards
      const estudiantesCard = statCards.find(card => 
        card.textContent.includes('Estudiantes')
      );
      const docentesCard = statCards.find(card => 
        card.textContent.includes('Docentes')
      );
      const adminsCard = statCards.find(card => 
        card.textContent.includes('Administradores')
      );
      const totalCard = statCards.find(card => 
        card.textContent.includes('Total Usuarios')
      );

      // Verify Bootstrap icons are used instead of emojis
      expect(estudiantesCard.getAttribute('data-icon')).toBe('mortarboard');
      expect(docentesCard.getAttribute('data-icon')).toBe('person-video3');
      expect(adminsCard.getAttribute('data-icon')).toBe('person-badge');
      expect(totalCard.getAttribute('data-icon')).toBe('person');
    });
  });

  it('should render StatCards with correct Bootstrap icons for matriculas section', async () => {
    dashboardApi.getEstadisticas.mockResolvedValue({ data: mockStats });

    render(
      <BrowserRouter>
        <DashboardAdmin />
      </BrowserRouter>
    );

    await waitFor(() => {
      const statCards = screen.getAllByTestId('stat-card');
      
      // Find the matriculas section cards
      const pendientesCard = statCards.find(card => 
        card.textContent.includes('Pendientes')
      );
      const aprobadasCard = statCards.find(card => 
        card.textContent.includes('Aprobadas')
      );
      const rechazadasCard = statCards.find(card => 
        card.textContent.includes('Rechazadas')
      );

      // Verify Bootstrap icons are used instead of emojis
      expect(pendientesCard.getAttribute('data-icon')).toBe('hourglass-split');
      expect(aprobadasCard.getAttribute('data-icon')).toBe('check-circle-fill');
      expect(rechazadasCard.getAttribute('data-icon')).toBe('x-circle-fill');
    });
  });

  it('should render StatCards with correct Bootstrap icons for catalogos section', async () => {
    dashboardApi.getEstadisticas.mockResolvedValue({ data: mockStats });

    render(
      <BrowserRouter>
        <DashboardAdmin />
      </BrowserRouter>
    );

    await waitFor(() => {
      const statCards = screen.getAllByTestId('stat-card');
      
      // Find the catalogos section cards
      const gruposCard = statCards.find(card => 
        card.textContent.includes('Grupos')
      );
      const carrerasCard = statCards.find(card => 
        card.textContent.includes('Carreras')
      );
      const asignaturasCard = statCards.find(card => 
        card.textContent.includes('Asignaturas')
      );
      const modalidadesCard = statCards.find(card => 
        card.textContent.includes('Modalidades')
      );

      // Verify Bootstrap icons are used instead of emojis
      expect(gruposCard.getAttribute('data-icon')).toBe('building');
      expect(carrerasCard.getAttribute('data-icon')).toBe('bullseye');
      expect(asignaturasCard.getAttribute('data-icon')).toBe('book-half');
      expect(modalidadesCard.getAttribute('data-icon')).toBe('mortarboard');
    });
  });

  it('should render ModuleCards with correct Bootstrap icons', async () => {
    dashboardApi.getEstadisticas.mockResolvedValue({ data: mockStats });

    render(
      <BrowserRouter>
        <DashboardAdmin />
      </BrowserRouter>
    );

    await waitFor(() => {
      const moduleCards = screen.getAllByTestId('module-card');
      
      // Verify all module cards have Bootstrap icon names instead of emojis
      const validacionCard = moduleCards.find(card => 
        card.textContent.includes('Validación de Matrículas')
      );
      const estudiantesCard = moduleCards.find(card => 
        card.textContent.includes('Gestión de Estudiantes')
      );
      const docentesCard = moduleCards.find(card => 
        card.textContent.includes('Gestión de Docentes')
      );
      const horariosCard = moduleCards.find(card => 
        card.textContent.includes('Gestión de Horarios')
      );
      const catalogosCard = moduleCards.find(card => 
        card.textContent.includes('Catálogos Académicos')
      );

      expect(validacionCard.getAttribute('data-icon')).toBe('file-text');
      expect(estudiantesCard.getAttribute('data-icon')).toBe('mortarboard');
      expect(docentesCard.getAttribute('data-icon')).toBe('person-video3');
      expect(horariosCard.getAttribute('data-icon')).toBe('calendar3');
      expect(catalogosCard.getAttribute('data-icon')).toBe('book');
    });
  });

  it('should display correct values in StatCards', async () => {
    dashboardApi.getEstadisticas.mockResolvedValue({ data: mockStats });

    render(
      <BrowserRouter>
        <DashboardAdmin />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('150')).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument();
      expect(screen.getAllByText('5')).toHaveLength(2); // Admins and Rechazadas both have value 5
      expect(screen.getByText('180')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('120')).toBeInTheDocument();
    });
  });
});

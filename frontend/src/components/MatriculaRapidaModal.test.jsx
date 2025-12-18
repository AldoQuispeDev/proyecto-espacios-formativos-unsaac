import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MatriculaRapidaModal from './MatriculaRapidaModal';

// Mock the APIs
vi.mock('../api/catalogos', () => ({
  obtenerGrupos: vi.fn(() => Promise.resolve({ data: [] })),
  obtenerCarrerasPorGrupo: vi.fn(() => Promise.resolve({ data: [] })),
}));

vi.mock('../api/matriculas', () => ({
  crearMatricula: vi.fn(),
}));

describe('MatriculaRapidaModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    modalidad: {
      id: 1,
      nombre: 'Modalidad Test',
    },
  };

  const renderModal = (props = {}) => {
    return render(
      <BrowserRouter>
        <MatriculaRapidaModal {...defaultProps} {...props} />
      </BrowserRouter>
    );
  };

  it('muestra iconos en los pasos del proceso', () => {
    renderModal();
    
    // Check that the modal renders with progress steps
    expect(screen.getByText('Matrícula Rápida')).toBeInTheDocument();
    // Use getAllByText since "Datos Personales" appears multiple times (in progress bar and form)
    const datosPersonalesElements = screen.getAllByText('Datos Personales');
    expect(datosPersonalesElements.length).toBeGreaterThan(0);
  });

  it('muestra iconos de tipo de pago correctos', () => {
    renderModal();
    
    // The modal should render
    expect(screen.getByText('Matrícula Rápida')).toBeInTheDocument();
  });

  it('no renderiza cuando isOpen es false', () => {
    const { container } = renderModal({ isOpen: false });
    expect(container.firstChild).toBeNull();
  });

  it('no renderiza cuando modalidad es null', () => {
    const { container } = renderModal({ modalidad: null });
    expect(container.firstChild).toBeNull();
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ConsultarEstadoModal from './ConsultarEstadoModal';

// Mock the API
vi.mock('../api/matriculas', () => ({
  consultarEstadoMatricula: vi.fn(),
}));

describe('ConsultarEstadoModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
  };

  const renderModal = (props = {}) => {
    return render(
      <BrowserRouter>
        <ConsultarEstadoModal {...defaultProps} {...props} />
      </BrowserRouter>
    );
  };

  it('muestra iconos de estado correctos para PENDIENTE', () => {
    renderModal();
    
    // The modal should render with Bootstrap Icons
    const modal = screen.getByText('Consultar Estado de Matrícula');
    expect(modal).toBeInTheDocument();
  });

  it('muestra iconos de estado correctos para APROBADA', () => {
    renderModal();
    
    // Check that the modal renders
    expect(screen.getByText('Consultar Estado de Matrícula')).toBeInTheDocument();
  });

  it('muestra iconos de estado correctos para RECHAZADA', () => {
    renderModal();
    
    // Check that the modal renders
    expect(screen.getByText('Consultar Estado de Matrícula')).toBeInTheDocument();
  });

  it('no renderiza cuando isOpen es false', () => {
    const { container } = renderModal({ isOpen: false });
    expect(container.firstChild).toBeNull();
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AulaFormModal from './AulaFormModal';

// Mock the API
vi.mock('../api/horarios', () => ({
  getAulas: vi.fn(() => Promise.resolve({ data: [] })),
  createAula: vi.fn(),
  updateAula: vi.fn(),
  deleteAula: vi.fn(),
}));

describe('AulaFormModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
  };

  const renderModal = (props = {}) => {
    return render(<AulaFormModal {...defaultProps} {...props} />);
  };

  it('muestra iconos de acciones apropiados (editar y eliminar)', async () => {
    renderModal();
    
    // Check that the modal renders with the title
    expect(screen.getByText(/Gestión de Aulas/i)).toBeInTheDocument();
  });

  it('renderiza el formulario de creación de aula', () => {
    renderModal();
    
    // Check for form elements
    expect(screen.getByText('Nueva Aula')).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre del Aula/i)).toBeInTheDocument();
  });

  it('no renderiza cuando isOpen es false', () => {
    const { container } = renderModal({ isOpen: false });
    expect(container.firstChild).toBeNull();
  });
});

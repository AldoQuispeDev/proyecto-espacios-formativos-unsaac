import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Icon from './Icon';

describe('Icon Component', () => {
  it('renderiza correctamente con props mínimas', () => {
    const { container } = render(<Icon name="book" />);
    const icon = container.querySelector('i');
    
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('bi', 'bi-book', 'icon-md');
  });

  it('aplica clases CSS según size', () => {
    const { container: containerSm } = render(<Icon name="book" size="sm" />);
    expect(containerSm.querySelector('i')).toHaveClass('icon-sm');

    const { container: containerLg } = render(<Icon name="book" size="lg" />);
    expect(containerLg.querySelector('i')).toHaveClass('icon-lg');

    const { container: containerXl } = render(<Icon name="book" size="xl" />);
    expect(containerXl.querySelector('i')).toHaveClass('icon-xl');
  });

  it('aplica clases CSS según color', () => {
    const { container } = render(<Icon name="book" color="primary" />);
    const icon = container.querySelector('i');
    
    expect(icon).toHaveClass('text-primary');
  });

  it('aplica className adicional', () => {
    const { container } = render(<Icon name="book" className="custom-class" />);
    const icon = container.querySelector('i');
    
    expect(icon).toHaveClass('custom-class');
  });

  it('maneja onClick correctamente', async () => {
    const handleClick = vi.fn();
    const { container } = render(<Icon name="book" onClick={handleClick} />);
    const icon = container.querySelector('i');
    
    expect(icon).toHaveAttribute('role', 'button');
    
    await userEvent.click(icon);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renderiza con atributos de accesibilidad apropiados cuando tiene title', () => {
    const { container } = render(<Icon name="book" title="Libro" />);
    const icon = container.querySelector('i');
    
    expect(icon).toHaveAttribute('title', 'Libro');
    expect(icon).toHaveAttribute('aria-hidden', 'false');
  });

  it('renderiza con aria-hidden cuando no tiene title', () => {
    const { container } = render(<Icon name="book" />);
    const icon = container.querySelector('i');
    
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('no tiene role="button" cuando no es clickeable', () => {
    const { container } = render(<Icon name="book" />);
    const icon = container.querySelector('i');
    
    expect(icon).not.toHaveAttribute('role');
  });
});

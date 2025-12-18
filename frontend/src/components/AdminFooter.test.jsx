import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminFooter from './AdminFooter';

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('AdminFooter', () => {
  it('renderiza iconos de contacto', () => {
    renderWithRouter(<AdminFooter />);
    
    // Verificar que la información de contacto está presente
    expect(screen.getByText(/info@academiapre.edu.pe/i)).toBeInTheDocument();
    expect(screen.getByText(/\+51 984 123 456/i)).toBeInTheDocument();
    expect(screen.getByText(/Av\. La Cultura 123, Cusco/i)).toBeInTheDocument();
  });

  it('renderiza iconos de redes sociales', () => {
    renderWithRouter(<AdminFooter />);
    
    // Verificar que los enlaces de redes sociales están presentes
    const facebookLink = screen.getByTitle('Facebook');
    const instagramLink = screen.getByTitle('Instagram');
    const youtubeLink = screen.getByTitle('YouTube');
    
    expect(facebookLink).toBeInTheDocument();
    expect(instagramLink).toBeInTheDocument();
    expect(youtubeLink).toBeInTheDocument();
  });

  it('renderiza enlaces rápidos con iconos', () => {
    renderWithRouter(<AdminFooter />);
    
    // Verificar que los enlaces rápidos están presentes
    expect(screen.getByText('Soporte Técnico')).toBeInTheDocument();
    expect(screen.getByText('Documentación')).toBeInTheDocument();
    expect(screen.getByText('Términos de Uso')).toBeInTheDocument();
    expect(screen.getByText('Política de Privacidad')).toBeInTheDocument();
  });

  it('renderiza información del sistema', () => {
    renderWithRouter(<AdminFooter />);
    
    // Verificar que la información del sistema está presente
    expect(screen.getByText(/Sistema Operativo/i)).toBeInTheDocument();
    expect(screen.getByText(/Versión 2\.0\.0/i)).toBeInTheDocument();
  });

  it('renderiza el copyright', () => {
    renderWithRouter(<AdminFooter />);
    
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${currentYear} Academia Pre UNSAAC`, 'i'))).toBeInTheDocument();
  });
});

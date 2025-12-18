// Componente de prueba simple
export default function Test() {
  return (
    <div style={{ 
      width: '100vw', 
      minHeight: '100vh', 
      backgroundColor: '#830000',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '20px',
      padding: '40px'
    }}>
      <h1><i className="bi bi-check-circle-fill" style={{ marginRight: '10px' }}></i>React está funcionando</h1>
      <p>Si ves esto, el problema está en otro componente</p>
      <button 
        onClick={() => alert('El JavaScript funciona')}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: 'white',
          color: '#830000',
          border: 'none',
          borderRadius: '5px'
        }}
      >
        Probar Click
      </button>

      <div style={{
        marginTop: '40px',
        padding: '30px',
        backgroundColor: 'white',
        color: '#333',
        borderRadius: '8px',
        maxWidth: '800px',
        width: '100%'
      }}>
        <h2 style={{ marginBottom: '20px' }}><i className="bi bi-check-circle-fill" style={{ marginRight: '10px', color: '#198754' }}></i>Verificación de Bootstrap Icons</h2>
        <p style={{ marginBottom: '20px' }}>Si puedes ver los iconos a continuación, Bootstrap Icons está correctamente instalado:</p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: '20px',
          marginTop: '20px'
        }}>
          <div style={{ textAlign: 'center', padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <i className="bi bi-book" style={{ fontSize: '2rem', color: '#0d6efd', display: 'block', marginBottom: '10px' }}></i>
            <span style={{ fontSize: '0.875rem', color: '#666' }}>book</span>
          </div>
          <div style={{ textAlign: 'center', padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <i className="bi bi-mortarboard" style={{ fontSize: '2rem', color: '#0d6efd', display: 'block', marginBottom: '10px' }}></i>
            <span style={{ fontSize: '0.875rem', color: '#666' }}>mortarboard</span>
          </div>
          <div style={{ textAlign: 'center', padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <i className="bi bi-person-video3" style={{ fontSize: '2rem', color: '#0d6efd', display: 'block', marginBottom: '10px' }}></i>
            <span style={{ fontSize: '0.875rem', color: '#666' }}>person-video3</span>
          </div>
          <div style={{ textAlign: 'center', padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <i className="bi bi-file-text" style={{ fontSize: '2rem', color: '#0d6efd', display: 'block', marginBottom: '10px' }}></i>
            <span style={{ fontSize: '0.875rem', color: '#666' }}>file-text</span>
          </div>
          <div style={{ textAlign: 'center', padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <i className="bi bi-calendar3" style={{ fontSize: '2rem', color: '#0d6efd', display: 'block', marginBottom: '10px' }}></i>
            <span style={{ fontSize: '0.875rem', color: '#666' }}>calendar3</span>
          </div>
          <div style={{ textAlign: 'center', padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <i className="bi bi-check-circle-fill" style={{ fontSize: '2rem', color: '#198754', display: 'block', marginBottom: '10px' }}></i>
            <span style={{ fontSize: '0.875rem', color: '#666' }}>check-circle</span>
          </div>
          <div style={{ textAlign: 'center', padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <i className="bi bi-x-circle-fill" style={{ fontSize: '2rem', color: '#dc3545', display: 'block', marginBottom: '10px' }}></i>
            <span style={{ fontSize: '0.875rem', color: '#666' }}>x-circle</span>
          </div>
          <div style={{ textAlign: 'center', padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <i className="bi bi-envelope" style={{ fontSize: '2rem', color: '#0d6efd', display: 'block', marginBottom: '10px' }}></i>
            <span style={{ fontSize: '0.875rem', color: '#666' }}>envelope</span>
          </div>
          <div style={{ textAlign: 'center', padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <i className="bi bi-telephone" style={{ fontSize: '2rem', color: '#0d6efd', display: 'block', marginBottom: '10px' }}></i>
            <span style={{ fontSize: '0.875rem', color: '#666' }}>telephone</span>
          </div>
          <div style={{ textAlign: 'center', padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <i className="bi bi-whatsapp" style={{ fontSize: '2rem', color: '#25D366', display: 'block', marginBottom: '10px' }}></i>
            <span style={{ fontSize: '0.875rem', color: '#666' }}>whatsapp</span>
          </div>
          <div style={{ textAlign: 'center', padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <i className="bi bi-geo-alt" style={{ fontSize: '2rem', color: '#dc3545', display: 'block', marginBottom: '10px' }}></i>
            <span style={{ fontSize: '0.875rem', color: '#666' }}>geo-alt</span>
          </div>
          <div style={{ textAlign: 'center', padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <i className="bi bi-heart-fill" style={{ fontSize: '2rem', color: '#dc3545', display: 'block', marginBottom: '10px' }}></i>
            <span style={{ fontSize: '0.875rem', color: '#666' }}>heart-fill</span>
          </div>
        </div>
        
        <p style={{ color: '#198754', fontWeight: 'bold', marginTop: '20px' }}>
          <i className="bi bi-check-lg" style={{ marginRight: '8px' }}></i>Si ves los iconos arriba, Bootstrap Icons está funcionando correctamente
        </p>
      </div>
    </div>
  );
}

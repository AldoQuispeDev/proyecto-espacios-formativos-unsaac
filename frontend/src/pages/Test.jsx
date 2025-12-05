// Componente de prueba simple
export default function Test() {
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      backgroundColor: '#830000',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <h1>✅ React está funcionando</h1>
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
    </div>
  );
}

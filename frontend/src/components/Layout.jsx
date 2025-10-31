export default function Layout({ title, children, onLogout, onBack }) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {/* 🔹 Encabezado superior */}
      <header className="w-full max-w-5xl flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>

        <div className="flex gap-3">
          {/* Botón Retroceder (solo si se envía la función onBack) */}
          {onBack && (
            <button
              onClick={onBack}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
            >
              ← Retroceder
            </button>
          )}

          {/* Botón Cerrar sesión (solo si se envía la función onLogout) */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
            >
              Cerrar sesión
            </button>
          )}
        </div>
      </header>

      {/* 🔹 Contenedor principal */}
      <main className="bg-white shadow-lg rounded-xl w-full max-w-5xl p-6 border border-gray-200">
        {children}
      </main>

      {/* 🔹 Pie de página opcional */}
      <footer className="mt-10 text-sm text-gray-500">
        Sistema de Matrículas © {new Date().getFullYear()} — Academia Preuniversitaria
      </footer>
    </div>
  );
}

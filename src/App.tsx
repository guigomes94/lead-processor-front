import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { UploadPage } from './pages/UploadPage';
import { LeadsPage } from './pages/LeadsPage';

function Navbar() {
  const location = useLocation();
  
  return (
    <nav className="flex justify-center border-b border-zinc-800 bg-zinc-950 p-4">
      <div className="flex space-x-6">
        <Link
          to="/"
          className={`font-medium transition-colors ${
            location.pathname === '/' ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Importar Arquivo
        </Link>
        <Link
          to="/leads"
          className={`font-medium transition-colors ${
            location.pathname === '/leads' ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Ver Leads
        </Link>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      {/* O menu fica fora das rotas para aparecer em todas as telas */}
      <Navbar /> 
      
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/leads" element={<LeadsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Header } from './components/Header.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import CardPerformance from './components/CardPerformance.jsx';
import { Login } from './pages/login.jsx';

function App() {
  const [usuario, setUsuario] = useState(() => {
    const saved = localStorage.getItem('usuario');
    return saved ? JSON.parse(saved) : null;
  });

  const [dados, setDados] = useState([]);
  const [setorAtivo, setSetorAtivo] = useState(null);
  const [mostrarDashboard, setMostrarDashboard] = useState(false);

  useEffect(() => {
    if (!usuario) return;
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3000/desempenho', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setDados(res.data))
      .catch(err => console.error('Erro ao buscar desempenho', err));
  }, [usuario]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  // Antes do login: mostra a tela de login
  if (!usuario) {
    return <Login onLogin={(u) => setUsuario(u)} />;
  }

  // KPIs do setor ativo ou todos os KPIs (página inicial)
  const kpisExibidos = setorAtivo
    ? dados.find(s => s.setor === setorAtivo.nome)?.kpis || []
    : dados.flatMap(s => s.kpis || []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header usuario={usuario} onLogout={handleLogout} />

      <div className="flex">
        <Sidebar
          setorAtivo={setorAtivo}
          onSetorChange={(setor) => { setSetorAtivo(setor); setMostrarDashboard(false); }}
          onDashboardOpen={() => { setMostrarDashboard(true); setSetorAtivo(null); }}
        />

        <main className="flex-1 p-10">
          {/* DASHBOARD: só aparece quando clicado na sidebar */}
          {mostrarDashboard && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#662D91] mb-4">Dashboard Geral</h2>
              {/* Coloque seu GraficoTendencia aqui */}
              <p className="text-slate-400">Gráficos de tendência aparecerão aqui.</p>
            </div>
          )}

          {/* CARDS DE PERFORMANCE: sempre visíveis na home */}
          {!mostrarDashboard && (
            <>
              <h1 className="text-2xl font-bold mb-6 text-[#662D91]">
                {setorAtivo ? `Setor: ${setorAtivo.nome}` : 'Painel de Indicadores'}
              </h1>
              {kpisExibidos.length === 0 ? (
                <p className="text-slate-400">Nenhum dado disponível.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {kpisExibidos.map(kpi => <KpiCard key={kpi.id} kpi={kpi} />)}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
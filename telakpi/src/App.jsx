import { useState, useEffect } from 'react';
import axios from 'axios';
import { Header } from './components/Header.jsx';
import { KpiCard } from './components/KpiCard';

function App() {
  const [dados, setDados] = useState([]);

  // Função simples só para carregar e ver se o dado chega
  useEffect(() => {
    axios.get('http://localhost:3000/desempenho')
      .then(res => setDados(res.data))
      .catch(err => console.error("O backend não respondeu!"));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header /> {/* O Header você já tem e está lindo, mantenha! */}
      
      <main className="p-10">
        <h1 className="text-2xl font-bold mb-6 text-[#662D91]">Painel de Indicadores</h1>
        
        {/* Se os dados sumiram, vamos fazer um teste simples de texto aqui */}
        {dados.length === 0 ? (
          <p>Carregando dados ou banco vazio...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Apenas os cards, sem a complexidade dos gráficos por enquanto */}
            {dados.map(setor => 
              setor.kpis?.map(kpi => <KpiCard key={kpi.id} kpi={kpi} />)
            )}
          </div>
        )}
      </main>
    </div>
  );
}
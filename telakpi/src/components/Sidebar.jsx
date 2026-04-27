import { useEffect, useState } from 'react';
import axios from 'axios';

export function Sidebar({ setorAtivo, onSetorChange, onDashboardOpen }) {
  const [setores, setSetores] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3000/setores', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setSetores(res.data))
      .catch(err => console.error('Erro ao buscar setores', err));
  }, []);

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-100 shadow-sm flex flex-col">
      <div className="p-6 border-b border-slate-100">
        <p className="text-xs uppercase font-bold text-slate-400 tracking-widest">Navegação</p>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-1">
        {/* Botão fixo: Dashboard Geral */}
        <button
          onClick={onDashboardOpen}
          className="w-full text-left px-4 py-2 rounded-lg text-sm font-semibold text-[#662D91] hover:bg-purple-50 transition-all flex items-center gap-2"
        >
          📊 Dashboard Geral
        </button>

        <div className="mt-4 mb-2">
          <p className="text-xs uppercase font-bold text-slate-400 px-4">Setores</p>
        </div>

        {/* Setores dinâmicos vindos do backend */}
        {setores.map(setor => (
          <button
            key={setor.id}
            onClick={() => onSetorChange(setor)}
            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${setorAtivo?.id === setor.id
                ? 'bg-[#662D91] text-white'
                : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {setor.nome}
          </button>
        ))}
      </nav>
    </aside>
  );
}
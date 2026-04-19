import { useState } from 'react';

export function ModalRegistro({ aberto, fechar, salvar, formData, setFormData, dados }) {
  const [setorSelecionado, setSetorSelecionado] = useState('');

  if (!aberto) return null;

  // Filtra os indicadores apenas do setor que foi escolhido no primeiro select
  const indicadoresFiltrados = dados.find(s => s.setor === setorSelecionado)?.kpis || [];

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-t-8 border-[#662D91]">
        <h3 className="text-2xl font-bold text-[#662D91] mb-6">Lançar Registro</h3>
        
        <form onSubmit={salvar} className="space-y-4">
          {/* 1. Escolha do Setor/Unidade */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase">1. Unidade / Setor</label>
            <select 
              required
              className="w-full border-2 border-slate-100 rounded-xl p-3 outline-none"
              value={setorSelecionado}
              onChange={(e) => {
                setSetorSelecionado(e.target.value);
                setFormData({...formData, indicadorId: ''}); // Reseta o indicador se mudar o setor
              }}
            >
              <option value="">Selecione o Setor...</option>
              {dados.map(s => <option key={s.setor} value={s.setor}>{s.setor}</option>)}
            </select>
          </div>

          {/* 2. Escolha do Indicador (Só habilita se houver setor) */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase">2. Indicador</label>
            <select 
              required
              disabled={!setorSelecionado}
              className="w-full border-2 border-slate-100 rounded-xl p-3 outline-none disabled:bg-slate-50"
              value={formData.indicadorId}
              onChange={(e) => setFormData({...formData, indicadorId: e.target.value})}
            >
              <option value="">Selecione o Indicador...</option>
              {indicadoresFiltrados.map(kpi => (
                <option key={kpi.id} value={kpi.id}>{kpi.nome}</option>
              ))}
            </select>
          </div>

          {/* 3. Data do Evento */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase">3. Data da Ocorrência</label>
            <input 
              type="date" required
              className="w-full border-2 border-slate-100 rounded-xl p-3 outline-none"
              value={formData.dataEvento}
              onChange={(e) => setFormData({...formData, dataEvento: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase">Valor</label>
              <input 
                type="number" step="0.01" required
                className="w-full border-2 border-slate-100 rounded-xl p-3"
                value={formData.valor}
                onChange={(e) => setFormData({...formData, valor: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase">Responsável</label>
              <input 
                type="text" required
                className="w-full border-2 border-slate-100 rounded-xl p-3"
                value={formData.responsavel}
                onChange={(e) => setFormData({...formData, responsavel: e.target.value})}
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-[#8CC63F] text-white py-4 rounded-xl font-bold shadow-lg">
            Confirmar Registro
          </button>
          <button type="button" onClick={fechar} className="w-full text-slate-400 font-bold py-2">Cancelar</button>
        </form>
      </div>
    </div>
  );
}
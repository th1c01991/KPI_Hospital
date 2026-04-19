// src/components/KpiCard.jsx
export function KpiCard({ kpi }) {
  const isMetaAtingida = kpi.status.includes('🟢');
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h4 className="font-bold text-slate-700 text-sm uppercase">{kpi.nome}</h4>
          <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${isMetaAtingida ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {kpi.status.split(' ')[1]}
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-black text-slate-800 tracking-tighter">{kpi.mediaAtual}</span>
          <span className="text-slate-400 text-[10px] font-bold uppercase">Meta: {kpi.metaEstabelecida}</span>
        </div>
      </div>
      <div className="h-2 w-full bg-slate-100">
        <div 
          className={`h-full transition-all duration-1000 ${isMetaAtingida ? 'bg-[#8CC63F]' : 'bg-rose-500'}`}
          style={{ width: `${Math.min((kpi.mediaAtual / kpi.metaEstabelecida) * 100, 100)}%` }}
        ></div>
      </div>
    </div>
  );
}
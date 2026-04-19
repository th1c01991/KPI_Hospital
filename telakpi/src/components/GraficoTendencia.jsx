// src/components/GraficoTendencia.jsx
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export function GraficoTendencia({ titulo, dadosMensais, meta }) {
  // Se não houver dados ainda, usamos um mock para a gerente ver o potencial
  const dataExemplo = dadosMensais || [
    { mes: 'Jan', valor: 2.1 },
    { mes: 'Fev', valor: 1.9 },
    { mes: 'Mar', valor: 2.4 },
    { mes: 'Abr', valor: 1.8 }, // Mês atual sendo alimentado pelos inputs diários
  ];

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-[#662D91] font-bold uppercase text-[10px] tracking-widest">{titulo}</h3>
          <p className="text-[10px] text-slate-400">Consolidado Mensal - Ano 2026</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-[#8CC63F]">Meta: {meta}</span>
        </div>
      </div>
      
      <div className="h-62.5 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dataExemplo}>
            <defs>
              <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#662D91" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#662D91" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="mes" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} 
            />
            <XAxis 
  dataKey="mes" 
  axisLine={false} 
  tickLine={false} 
  tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}}
  
  // SOLUÇÃO AQUI:
  interval={0}           // Força o Recharts a mostrar TODOS os meses, sem pular nenhum
  minTickGap={0}        // Garante que ele não esconda nada por falta de espaço
  padding={{ left: 20, right: 20 }} // Dá um "respiro" nas pontas para o texto não ser cortado
/>
            {/* LINHA DE META: Gestor ama ver isso para saber se o mês fechou no verde */}
            <ReferenceLine y={meta} stroke="#8CC63F" strokeDasharray="3 3" label={{ position: 'right', value: 'META', fill: '#8CC63F', fontSize: 10 }} />
            
            <Area 
              type="monotone" 
              dataKey="valor" 
              stroke="#662D91" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorValor)" 
              dot={{ fill: '#662D91', strokeWidth: 2, r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
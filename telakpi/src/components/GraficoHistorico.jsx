import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function GraficoHistorico({ dados, meta }) {
  if (!dados || dados.length === 0) return <div className="p-10 text-center text-gray-400">Carregando histórico...</div>;

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-87.5 w-full">
      <h3 className="text-lg font-bold text-gray-700 mb-6">Tendência de IPCS (6 Meses)</h3>
      
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={dados}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="mes" 
            axisLine={false} 
            tickLine={false} 
            tick={{fill: '#9ca3af', fontSize: 12}} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{fill: '#9ca3af', fontSize: 12}} 
          />
          <Tooltip 
            contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
          />
          
          {/* Linha da Meta */}
          <ReferenceLine y={meta} label={{ value: 'Meta', position: 'right', fill: '#ef4444', fontSize: 10 }} stroke="#ef4444" strokeDasharray="3 3" />
          
          {/* Linha da Performance */}
          <Line 
            type="monotone" 
            dataKey="performance" 
            stroke="#8CC63F" 
            strokeWidth={4} 
            dot={{ r: 6, fill: '#8CC63F', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
import React from 'react';

// Este componente recebe os dados processados do Backend via "props"
export default function CardPerformance({ dados }) {
  // 1. O que mostrar se os dados ainda não chegaram?
  if (!dados) {
    return (
      <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm animate-pulse max-w-sm">
        <div className="h-4 bg-gray-200 rounded-full w-48 mb-4"></div>
        <div className="h-10 bg-gray-200 rounded-full w-24 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded-full w-32"></div>
      </div>
    );
  }

  // 2. A "Lógica de Cores" (O Diagnóstico Visual)
  // Definimos as cores do texto, fundo e barra com base no status do Backend
  const estiloStatus = {
    SUCESSO: {
      texto: 'text-green-700',
      fundo: 'bg-green-50 border-green-100',
      barra: 'bg-green-600',
    },
    ALERTA_VERMELHO: {
      texto: 'text-red-700',
      fundo: 'bg-red-50 border-red-100',
      barra: 'bg-red-600',
    },
    INDEFINIDO: {
      texto: 'text-gray-700',
      fundo: 'bg-gray-50 border-gray-100',
      barra: 'bg-gray-400',
    },
  };

  // Selecionamos o estilo correto ou usamos "INDEFINIDO" como padrão de segurança
  const { texto, fundo, barra } = estiloStatus[dados.status] || estiloStatus.INDEFINIDO;

  // Cálculo visual da barra de progresso (limiado a 100%)
// 1. A NOVA MATEMÁTICA À PROVA DE ZERO
  let percentualVisual = 0;
  if (dados.metaEsperada === 0) {
    // Se a meta é zero e houve infecção, a barra enche 100% (vermelha)
    percentualVisual = Number(dados.performance) > 0 ? 100 : 0;
  } else if (dados.metaEsperada > 0) {
    // Conta normal se a meta for maior que zero
    percentualVisual = Math.min((Number(dados.performance) / Number(dados.metaEsperada)) * 100, 100);
  }

  // 3. O Visual do Card (JSX)
  return (
    <div className={`p-6 bg-white border rounded-3xl shadow-sm max-w-sm transition-all hover:shadow-lg ${fundo}`}>
      {/* Nome do Indicador */}
      <div className="flex justify-between items-start gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider opacity-80 text-gray-800">
          {dados.indicador}
        </h3>
        <span className={`px-3 py-1 text-xs font-bold rounded-full ${fundo} ${texto}`}>
          {dados.status}
        </span>
      </div>
      
      {/* O Número Grande (Performance Atual) */}
      <div className="mt-5 flex items-baseline gap-2">
        <span className={`text-5xl font-extrabold tracking-tight ${texto}`}>
          {/* Garante que o número tem 2 casas decimais */}
          {Number(dados.performance).toFixed(2)}%
        </span>
        <span className="text-sm font-medium text-gray-500">
    / meta {dados.metaEsperada !== undefined ? dados.metaEsperada : '---'}</span>
      </div>

      {/* A Barra de Progresso Visual */}
      <div className="mt-6 w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${barra}`} 
          style={{ width: `${percentualVisual}%` }}
        ></div>
      </div>

      {/* O "Boletim Médico" (Detalhes de Acumulação) */}
      <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between text-xs text-gray-500 font-medium">
        <span>Numerador: {dados.numeradorAcumulado}</span>
        <span>Denominador: {dados.denominadorMensal}</span>
      </div>
    </div>
  );
}
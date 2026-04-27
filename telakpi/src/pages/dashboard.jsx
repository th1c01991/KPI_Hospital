import React, { useState, useEffect } from 'react';
import CardPerformance from '../components/CardPerformance';
import ModalRegistro from '../components/ModalRegistro';
import GraficoHistorico from '../components/GraficoHistorico';
import ModalVariavel from '../components/ModalVariavel';

export default function Dashboard({ setorId, hospitalId }) {
  const [dadosPerformance, setDadosPerformance] = useState(null);
  const [dadosHistorico, setDadosHistorico] = useState([]);
  const [erro, setErro] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalVariavelAberto, setModalVariavelAberto] = useState(false);

  // O ID do IPCS que estamos a testar
  const indicadorId = "2a1fffd1-282b-42f1-b2a2-ffbf0f090579";

  useEffect(() => {
    async function carregarDados() {
      try {
        setErro(null);
        
        const urlPerformance = `http://localhost:3000/performance?hospitalId=${hospitalId}&setorId=${setorId}&indicadorId=${indicadorId}&mes=2026-04`;
        const urlHistorico = `http://localhost:3000/historico?hospitalId=${hospitalId}&setorId=${setorId}&indicadorId=${indicadorId}`;

        const [resPerf, resHist] = await Promise.all([
          fetch(urlPerformance),
          fetch(urlHistorico)
        ]);

        if (!resPerf.ok || !resHist.ok) {
          throw new Error("Erro ao carregar dados do servidor. Verifica as metas no Prisma.");
        }

        const jsonPerf = await resPerf.json();
        const jsonHist = await resHist.json();

        setDadosPerformance(jsonPerf);
        setDadosHistorico(jsonHist);

      } catch (error) {
        setErro(error.message);
        setDadosPerformance(null);
        setDadosHistorico([]);
      }
    }

    if (setorId && hospitalId) {
      carregarDados();
    }
  }, [setorId, hospitalId]);

  return (
    <div className="w-full max-w-7xl mx-auto">
      
      {/* CABEÇALHO CORRIGIDO: Apenas uma div agrupando os dois botões */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-[#662D91]">Dashboard de Gestão Clínica</h2>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setModalVariavelAberto(true)} 
            className="border-2 border-[#662D91] text-[#662D91] px-4 py-2 rounded-lg font-bold hover:bg-[#662D91] hover:text-white transition-colors"
          >
            ⚙️ Configurar Mês
          </button>

          <button 
            onClick={() => setModalAberto(true)} 
            className="bg-[#8CC63F] text-white px-6 py-2.5 rounded-xl font-bold shadow-lg hover:bg-[#7ab035] transition-all transform hover:scale-105"
          >
            + Novo Registro
          </button>
        </div>
      </div>
      
      {erro && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl mb-8 animate-pulse">
          ⚠️ {erro}
        </div>
      )}

      <div className="flex flex-col gap-8">
        <div className="w-full lg:w-1/3">
          <CardPerformance dados={dadosPerformance} />
        </div>

        <div className="w-full">
          <GraficoHistorico 
            dados={dadosHistorico} 
            meta={dadosPerformance?.metaEsperada ?? 0} 
          />
        </div>
      </div>

      {modalAberto && (
        <ModalRegistro 
          aoFechar={() => setModalAberto(false)}
          hospitalId={hospitalId} 
          setorId={setorId}
        />
      )}

      {/* Renderização do novo modal */}
      {modalVariavelAberto && (
        <ModalVariavel 
          aoFechar={() => setModalVariavelAberto(false)}
          hospitalId={hospitalId}
          setorId={setorId}
        />
      )}
    </div>
  );
}
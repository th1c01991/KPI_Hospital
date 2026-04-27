import React, { useState, useEffect } from 'react';

export default function ModalVariavel({ aoFechar, hospitalId, setorId }) {
  const [nomeVariavel, setNomeVariavel] = useState('Cateteres-dia');
  const [valor, setValor] = useState('');
  const [mesReferencia, setMesReferencia] = useState(new Date().toISOString().slice(0, 7));
  
  // NOVOS ESTADOS PARA O DROPDOWN DINÂMICO
  const [setores, setSetores] = useState([]);
  const [setorSelecionado, setSetorSelecionado] = useState(setorId || ''); // Usa o setor atual da tela como padrão

  // Busca os setores no Backend assim que o Modal abre
  useEffect(() => {
    async function buscarSetores() {
      try {
        const resposta = await fetch(`http://localhost:3000/setores?hospitalId=${hospitalId}`);
        if (resposta.ok) {
          const dados = await resposta.json();
          setSetores(dados);
        }
      } catch (erro) {
        console.error("Erro ao carregar setores no modal:", erro);
      }
    }
    if (hospitalId) buscarSetores();
  }, [hospitalId]);

  const lidarComSubmissao = async (e) => {
    e.preventDefault();

    try {
      // Trava de segurança: impede envio sem setor
      if (!setorSelecionado) {
        throw new Error("Por favor, selecione um setor antes de salvar.");
      }

      const dataFormatada = `${mesReferencia}-01T00:00:00.000Z`;

      const resposta = await fetch('http://localhost:3000/variaveis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nomeVariavel,
          valor: Number(valor),
          hospitalId: hospitalId,
          setorId: setorSelecionado, // Agora enviamos o setor escolhido na lista!
          mes: dataFormatada
        })
      });

      if (!resposta.ok) throw new Error('Erro ao salvar denominador');

      alert("Denominador atualizado com sucesso!");
      aoFechar();
      window.location.reload(); 
    } catch (erro) {
      alert("❌ Erro: " + erro.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        
        <div className="bg-[#662D91] px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Configurar Denominador</h3>
          <button onClick={aoFechar} className="text-white/70 hover:text-white text-2xl font-bold transition-colors">&times;</button>
        </div>

        <form onSubmit={lidarComSubmissao} className="p-6 space-y-4">
          
          {/* NOVO CAMPO: Dropdown de Setores Dinâmico */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Setor</label>
            <select 
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#8CC63F] outline-none bg-white"
              value={setorSelecionado}
              onChange={(e) => setSetorSelecionado(e.target.value)}
            >
              <option value="" disabled>Selecione o setor...</option>
              {setores.map((setor) => (
                <option key={setor.id} value={setor.id}>
                  {setor.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nome da Variável</label>
            <input 
              type="text"
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#8CC63F] outline-none"
              value={nomeVariavel}
              onChange={(e) => setNomeVariavel(e.target.value)}
              placeholder="Ex: Cateteres-dia"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Mês de Referência</label>
              <input 
                type="month" 
                required
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#8CC63F] outline-none"
                value={mesReferencia}
                onChange={(e) => setMesReferencia(e.target.value)}
              />
            </div>

            <div className="w-1/3">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Total</label>
              <input 
                type="number" 
                required
                min="1"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#8CC63F] outline-none"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="Ex: 500"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3 justify-end border-t border-gray-100">
            <button type="button" onClick={aoFechar} className="px-5 py-2.5 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg transition-colors">
              Cancelar
            </button>
            <button type="submit" className="px-5 py-2.5 bg-[#662D91] text-white font-bold rounded-lg hover:bg-[#522475] shadow transition-colors">
              Salvar Denominador
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
import React, { useState } from 'react';

export default function ModalRegistro({ aoFechar }) {
  // Estados para guardar o que o utilizador digita no formulário
  const [indicadorSelecionado, setIndicadorSelecionado] = useState('');
  const [dataEvento, setDataEvento] = useState(new Date().toISOString().split('T')[0]); // Data de hoje por padrão
  const [quantidade, setQuantidade] = useState('');
  const [observacao, setObservacao] = useState('');
  const [setor, setSetor] = useState(''); // Estado para o setor (No futuro, vamos buscar a lista de setores do backend!)
  const [hospital, setHospital] = useState(''); // Estado para o hospital (No futuro, vamos buscar a lista de hospitais do backend!)
  const [responsavel, setResponsavel] = useState(''); // Estado para o responsável (No futuro, vamos buscar a lista de responsáveis do backend!)
  // Função para simular o envio dos dados (No futuro, vai ligar ao Fastify!)
  const lidarComSubmissao = async (e) => {
    e.preventDefault(); // Evita que a página recarregue

   try {
      // Barreira de segurança: impede o envio se faltar setor ou hospital
      if (!setor || !hospital || !responsavel) {
        throw new Error("Por favor, selecione o Hospital, o Setor e o Responsável antes de salvar.");
      }

      const resposta = await fetch('http://localhost:3000/registros', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          indicadorId: indicadorSelecionado,
          dataEvento: dataEvento,
          quantidade: Number(quantidade),
          justificativa: observacao,
          
          setorId: setor,
          hospitalId: hospital, // Usa a escolha do novo Dropdown que vamos fazer abaixo!
          responsavelId: responsavel
        })
      });

      if (!resposta.ok) {
        throw new Error('Erro ao salvar o registro');
      }
    alert("Registro salvo com sucesso! (Simulação)");
    aoFechar(); // Fecha a janela após salvar
    // 3. Truque de MVP: Recarrega a página rapidamente para o Card puxar o número atualizado!
      window.location.reload(); 

    } catch (erro) {
      alert("❌ Erro ao salvar: " + erro.message);
    }
  };

  return (
    // Fundo escuro semi-transparente que cobre a tela toda
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
      
      {/* A "Janela" Branca do Modal */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        
        {/* Cabeçalho do Modal */}
        <div className="bg-[#662D91] px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Adicionar Novo Registro</h3>
          <button 
            onClick={aoFechar}
            className="text-white/70 hover:text-white text-2xl font-bold transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Corpo (Formulário) */}
        <form onSubmit={lidarComSubmissao} className="p-6 space-y-4">
          
          {/* Campo: Indicador */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Qual Indicador?</label>
            <select 
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#8CC63F] focus:border-[#8CC63F] outline-none"
              value={indicadorSelecionado}
              onChange={(e) => setIndicadorSelecionado(e.target.value)}
            >
              <option value="" disabled>Selecione um indicador...</option>
              {/* No futuro, o React vai buscar esta lista ao backend! */}
              <option value="id-ocupacao">Taxa de Ocupação (Pacientes-Dia)</option>
              <option value="2a1fffd1-282b-42f1-b2a2-ffbf0f090579">Infecção de Corrente Sanguínea (IPCS)</option>
              <option value="id-queda">Queda de Paciente</option>
            </select>
          </div>

          <div className="flex gap-4">
            {/* Campo: Data */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Data do Evento</label>
              <input 
                type="date" 
                required
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#8CC63F] outline-none"
                value={dataEvento}
                onChange={(e) => setDataEvento(e.target.value)}
              />
            </div>

            {/* Campo: Quantidade */}
            <div className="w-1/3">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Quantidade</label>
              <input 
                type="number" 
                min="1"
                required
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#8CC63F] outline-none"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                placeholder="Ex: 1"
              />
            </div>
          </div>

          {/* Campo: Setor */}
           <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Setor</label>
            <select 
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#8CC63F] focus:border-[#8CC63F] outline-none"
              value={setor}
              onChange={(e) => setSetor(e.target.value)}
            >
              <option value="" disabled>Selecione um setor...</option>
              {/* No futuro, o React vai buscar esta lista ao backend! */}
              <option value="5351b43b-3379-4996-b547-ca8035a4c2b0">UTI Adulto</option>
              <option value="b3ce25c3-e3bc-479d-a22d-d4b2ae02cf89">UTI Pediátrica</option>
              <option value="cffa20a5-31e4-4a07-902d-9a2a9f598608">Unidade de internação adulto</option>
            </select>
          </div>

{/* Campo: Responsavel */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Responsável</label>
            <select 
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#8CC63F] focus:border-[#8CC63F] outline-none"
              value={responsavel}
              onChange={(e) => setResponsavel(e.target.value)}
            >
              <option value="" disabled>Selecione o responsável</option>
              {/* No futuro, o React vai buscar esta lista ao backend! */}
              <option value="d5dd92b8-2453-4005-ad16-1c18e945c7d2">Thiago</option>

            </select>
          </div>


            {/* Campo: hospital */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Hospital</label>
            <select 
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#8CC63F] focus:border-[#8CC63F] outline-none"
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
            >
              <option value="" disabled>Selecione o hospital...</option>
              {/* ATENÇÃO: Substitua os values abaixo pelos UUIDs reais dos seus hospitais! */}
              <option value="COLOQUE-O-UUID-DO-VITORIA-AQUI">Hospital Vitória</option>
              <option value="c8668a10-3386-4681-9933-3464d123bf8a">Hospital Samaritano</option>
            </select>
          </div>


          {/* Campo: Observação/Justificativa (Aquele diário de bordo que pediste!) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Observação / Justificativa <span className="text-gray-400 font-normal text-xs">(Opcional)</span>
            </label>
            <textarea 
              rows="3"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#8CC63F] outline-none resize-none"
              placeholder="Ex: Infecção de cateter PICC em paciente com 45 dias de internação..."
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
            ></textarea>
          </div>

          {/* Rodapé: Botões de Ação */}
          <div className="pt-4 flex gap-3 justify-end border-t border-gray-100">
            <button 
              type="button"
              onClick={aoFechar}
              className="px-5 py-2.5 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-5 py-2.5 bg-[#8CC63F] text-white font-bold rounded-lg hover:bg-[#7ab035] shadow transition-colors"
            >
              Salvar Registro
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
// Rota para o Gráfico: Busca os últimos 6 meses
server.get('/historico', async (request, reply) => {
  try {
    const { hospitalId, setorId, indicadorId } = request.query;

    const hoje = new Date();
    const historico = [];

    // Loop para buscar os últimos 6 meses
    for (let i = 5; i >= 0; i--) {
      const dataBusca = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const mesFormatado = dataBusca.toISOString().slice(0, 7); // Ex: "2026-04"
      
      const dataInicio = new Date(dataBusca.getFullYear(), dataBusca.getMonth(), 1);
      const dataFim = new Date(dataBusca.getFullYear(), dataBusca.getMonth() + 1, 1);

      // 1. Soma os registros do mês
      const soma = await dataBase.registro.aggregate({
        _sum: { quantidade: true },
        where: {
          setorId, indicadorId, hospitalId,
          dataEvento: { gte: dataInicio, lt: dataFim }
        }
      });

      // 2. Busca o denominador daquele mês específico
      const variavel = await dataBase.variavelOperacional.findFirst({
        where: {
          setorId, hospitalId,
          mes: { gte: dataInicio, lt: dataFim }
        }
      });

      const numerador = soma._sum.quantidade || 0;
      const denominador = variavel ? Number(variavel.valor) : null;
      
      let performance = 0;
      if (denominador && denominador > 0) {
        // Exemplo fixo de multiplicador 1000 para IPCS (você pode buscar do indicador se preferir)
        performance = Number(((numerador / denominador) * 1000).toFixed(2));
      }

      historico.push({
        mes: mesFormatado,
        performance: performance,
        // Se não houver denominador, o gráfico saberá que o dado está incompleto
        incompleto: !variavel 
      });
    }

    return reply.send(historico);
  } catch (error) {
    return reply.status(500).send({ erro: 'Erro ao buscar histórico.' });
  }
});
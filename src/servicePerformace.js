export function calcularRelatorio(setoresDb) {
  const agora = new Date();
  const mesAtual = agora.getMonth();
  const anoAtual = agora.getFullYear();

  return setoresDb.map(setor => {
    const indicadoresCalculados = setor.indicadores.map(indicador => {
      
      // FILTRO: Pegamos apenas os registros do mês atual para o Card Principal
      const registrosDoMes = indicador.registros.filter(reg => {
        const dataReg = new Date(reg.dataEvento);
        return dataReg.getMonth() === mesAtual && dataReg.getFullYear() === anoAtual;
      });

      const totalRegistros = registrosDoMes.length;
      const soma = registrosDoMes.reduce((acc, reg) => acc + reg.valor, 0);
      const mediaAtual = totalRegistros > 0 ? soma / totalRegistros : 0;

      // Lógica de Meta (Sua lógica original está perfeita, mantivemos)
      let bateuAMeta = false;
      if (indicador.direcao === 'MAIOR_MELHOR') {
        bateuAMeta = mediaAtual >= indicador.meta;
      } else {
        bateuAMeta = mediaAtual <= indicador.meta;
      }

      return {
        id: indicador.id, // Importante para o React usar como 'key'
        nome: indicador.nome,
        metaEstabelecida: indicador.meta,
        mediaAtual: parseFloat(mediaAtual.toFixed(2)),
        // DICA: Mande um booleano para o Front facilitar as cores do Tailwind
        sucesso: bateuAMeta, 
        status: bateuAMeta ? '🟢 Meta Atingida' : '🔴 Fora da Meta',
        anotacoesFeitas: totalRegistros,
        // Enviar os registros brutos para o gráfico mensal usar depois
        historico: indicador.registros 
      };
    });

    return {
      setor: setor.nome,
      kpis: indicadoresCalculados
    };
  });
}
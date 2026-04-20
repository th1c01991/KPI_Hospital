import 'dotenv/config';
import fastify from 'fastify';
import cors from '@fastify/cors';

// IMPORTANTE: Adicione o .js no final do arquivo!
import { dataBase } from './dataBase.js'; 
import { calcularRelatorio } from './servicePerformace.js';

// 3. Inicialização do Servidor
const server = fastify({ logger: true });

await server.register(cors, { 
  origin: true 
});

// Rota 1: INFRAESTRUTURA
// Cadastro do hospital (POST)
server.post('/hospitais', async (request, reply) => {
  try {
    const { nome, cnpj } = request.body;

    const novoHospital = await dataBase.hospital.create({
      data: { 
        nome, 
        cnpj }
    });

    return reply.status(201).send({
      mensagem: 'Hospital criado com sucesso!',
      data: novoHospital
    });

  } catch (erro) {
    console.error(erro);
    return reply.status(500).send({ erro: 'Erro ao criar hospital.' });
  }
});

// Cadastro do usuário (POST)
server.post('/usuarios', async (request, reply) => {
  try {
    const { nome, email, password, hospitalId } = request.body;

    const novoUsuario = await dataBase.user.create({
        data: {
          nome,
          email,
          password,
          hospitalId
        }
  })
    return reply.status(201).send({
      mensagem: 'Usuário criado com sucesso',
      data: novoUsuario
    });

  } catch (erro) {
    console.error(erro);
    return reply.status(500).send({ erro: 'Erro ao criar usuário. '})
  }
});

// Rota 2: REGISTRO DE SETORES E INDICADORES
// Cadastro do setor (POST)
server.post('/setores', async (request, reply) => {

  try {
    // 1. O Prisma cria o registro e guarda tudo (incluindo o ID) nesta variável
    const { nome, hospitalId } = request.body;

    const novoSetor = await dataBase.setor.create({
      data: { 
        nome, 
        hospitalId
      }
    });

    // 2. Você precisa passar essa variável dentro do .send()
    return reply.status(201).send({
      mensagem: 'Setor criado com sucesso!',
      data: novoSetor
    }); 
  } catch (erro) {
    console.error(erro);
    return reply.status(500).send({ erro: 'Erro ao criar setor.' });
  }
});


// Cadastro do indicador (POST)
server.post('/indicadores', async (request, reply) => {
  try {
    const { nome, descricao, multiplicador, direcaoMeta, hospitalId } = request.body;

    const novoIndicador = await dataBase.indicador.create({
      data: {
        nome,
        descricao,
        multiplicador,
        direcaoMeta,
        hospitalId
      }
    });

    return reply.status(201).send({
      mensagem: 'Indicador criado com sucesso!',
      data: novoIndicador
    });

  } catch (erro) {
    console.error(erro);
    return reply.status(500).send({ erro: 'Erro ao criar indicador.' });
  }
});


// Cadastro de indicador para setor (POST)
server.post('/indicadores-setores', async (request, reply) => {
  
  try {
    const { metaSetor, setorId, indicadorId, hospitalId } = request.body;

    const novoIndicadorSetor = await dataBase.indicador_Setor.create({
      data: { 
        metaSetor,
        setorId,
        indicadorId,
        hospitalId
      }
      });

    return reply.status(201).send({
      mensagem: 'Indicador para o setor criado com sucesso!',
      data: novoIndicadorSetor
    });
  } catch (erro) {
      console.log(erro);
      return reply.status(500).send({ erro:"Erro ao criar indicador para seu setor"})
    }
  });

// Cadastro do registro (POST)
server.post('/registros', async (request, reply) => {
  try {
    const { dataEvento, quantidade, responsavelId, justificativa, hospitalId, indicadorId, setorId } = request.body;

    const novoRegistro = await dataBase.registro.create({
      data: {
        dataEvento: new Date(dataEvento), // Convertendo a string para um objeto Date
        quantidade,
        responsavelId,
        justificativa,
        hospitalId,
        indicadorId,
        setorId
      }
    });

    return reply.status(201).send({
      mensagem: 'Registro criado com sucesso!',
      data: novoRegistro
    });
  } catch (erro) {
    console.error(erro);
    return reply.status(500).send({ erro: 'Erro ao criar registro.' });
  }
});

// Cadastro de variaveis (POST)
server.post('/variaveis', async (request, reply) => {
  try {
    const { nome, valor, hospitalId, mes, setorId } = request.body;

    const novaVariavel = await dataBase.variavelOperacional.create({
      data: {
        nome,
        valor,
        hospitalId,
        mes: new Date(mes), // Convertendo a string para um objeto Date
        setorId
      }
    });

    return reply.status(201).send({
      mensagem: 'Variável criada com sucesso!',
      data: novaVariavel
    });
  } catch (erro) {
    console.error(erro);
    return reply.status(500).send({ erro: 'Erro ao criar variável.' });
  }
});

// Rota 3
// Captação de perfermoce dos setores (GET)
server.get('/performance', {
  schema: {
    querystring: {
      type: 'object',
      required: ['hospitalId', 'setorId', 'indicadorId', 'mes'],
      properties: {
        hospitalId: { type: 'string' },
        setorId: { type: 'string' },
        indicadorId: { type: 'string' },
        mes: { type: 'string', pattern: '^\\d{4}-\\d{2}$' } 
      }
    }
  }
}, async (request, reply) => {
  try {
    const { hospitalId, setorId, indicadorId, mes } = request.query;

    const dataInicio = new Date(`${mes}-01T00:00:00.000Z`);
    const dataFim = new Date(dataInicio);
    dataFim.setMonth(dataFim.getMonth() + 1); 

    // 2. Buscar as Regras Fixas
    const indicador = await dataBase.indicador.findUnique({ where: { id: indicadorId } });
    
    // CORREÇÃO 1: findFirst e tirar o metaSetor do where
    const regraSetor = await dataBase.indicador_Setor.findFirst({
      where: { setorId, indicadorId, hospitalId } 
    });

    if (!indicador || !regraSetor) {
      return reply.status(404).send({ erro: 'Indicador ou Meta não configurados para este setor.' });
    }

    // 3. Buscar o Denominador 
    const variavel = await dataBase.variavelOperacional.findFirst({
      where: {
        setorId: setorId,
        hospitalId: hospitalId,
        mes: { gte: dataInicio, lt: dataFim } 
      }
    });

    if (!variavel || variavel.valor === 0) {
      return reply.status(400).send({ erro: 'Denominador (Variável) não preenchido neste mês.' });
    }

    const denominador = variavel.valor;

    // 4. Buscar o Numerador 
    const somaRegistros = await dataBase.registro.aggregate({
      _sum: { quantidade: true },
      where: {
        setorId, indicadorId, hospitalId,
        dataEvento: { gte: dataInicio, lt: dataFim }
      }
    });

    const numerador = somaRegistros._sum.quantidade || 0;
    const meta = Number(regraSetor.metaSetor); // A meta limpa e convertida

    // 5. O Motor Matemático
    const performanceAtual = (numerador / denominador) * indicador.multiplicador;

    // 6. O Diagnóstico Final (Decisão)
    let statusDaMeta = 'INDEFINIDO';
    
    // CORREÇÃO 2: Substituir metaSetor por meta nos IFs
    if (indicador.direcaoMeta === 'MAIOR_MELHOR') {
      statusDaMeta = performanceAtual >= meta ? 'SUCESSO' : 'ALERTA_VERMELHO';
    } else if (indicador.direcaoMeta === 'MENOR_MELHOR') {
      statusDaMeta = performanceAtual <= meta ? 'SUCESSO' : 'ALERTA_VERMELHO';
    }

    return reply.status(200).send({
      mesReferencia: mes,
      indicador: indicador.nome,
      numeradorAculumado: numerador,
      denominadorMensal: denominador,
      performance: performanceAtual.toFixed(2), 
      metaEsperada: meta,
      status: statusDaMeta
    });

  } catch (error) {
    server.log.error(error);
    return reply.status(500).send({ erro: 'Erro ao calcular a performance do setor.' });
  }
});



server.get('/setores', async (request, reply) => {

  try {
    const listarSetores = await dataBase.setor.findMany({
      include: {
        indicadores: { include: {
          registros: true }
        },
      }
    });

    return reply.status(200).send(listarSetores);
  } catch (erro) {
    console.error(erro);
    return reply.status(500).send({ erro: 'Erro ao buscar setores.' });
  }
});


// Rota 3: GET para listar desempenho dos setores, com opção de busca
server.get('/desempenho', async (request, reply) => {
  try {
    const setoresDb = await dataBase.setor.findMany({
      include: {
        indicadores: { include: {
          registros: true }
        },
      }
    });

    const relatorioPronto = calcularRelatorio(setoresDb);

    return reply.status(200).send(relatorioPronto);
  } catch (erro) {
    console.error(erro);
    return reply.status(500).send({ erro: 'Erro ao buscar desempenho.' });
  }
});

// Rota 4: PUT para ATUALIZAR um setor
server.put('/setores/:id', async (request, reply) => {
  // Pegamos o ID que vem na URL e o novo nome que vem no corpo
  try {
  const  id = Number (request.params.id); // Convertendo o ID para número, se necessário

  //Pegamos o novo nome enviado pelo React (request.body)
  const { nome } = request.body;

  const nomePadronizado = padronizarTexto(nome);

  const setorAtualizado = await dataBase.setor.update({
    // Como a URL sempre envia texto, convertemos o ID para número (se o seu ID for número)
    where: { id: id }, 
    data: { nome: nomePadronizado(nome) }
  });
    
    return reply.status(200).send(setorAtualizado);
  } catch (erro) {
    console.error(erro);
    return reply.status(500).send({ erro: 'Não foi possível atualizar o setor.' });
  }
});

server.delete('/setores/:id', async (request, reply) => {
  try {
    const id = Number(request.params.id); // Convertendo o ID para número, se necessário

    const setorExcluido = await dataBase.setor.delete({
      where: { id: id }
    });

    return reply.status(200).send(setorExcluido);
  } catch (erro) {
    console.error(erro);
    return reply.status(500).send({ erro: 'Não foi possível excluir o setor.' });
  }
});

// Run the server!
try {
  await server.listen({ port: 3000 })
} catch (err) {
  server.log.error(err)
  process.exit(1)
}
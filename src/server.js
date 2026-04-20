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

// Rota 2: GET para listar os setores, com opção de busca
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
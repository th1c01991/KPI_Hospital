import { PrismaClient } from '@prisma/client';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { padronizarTexto } from './utils.js';

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prismaBase = new PrismaClient({ adapter });

export const dataBase = prismaBase.$extends({
  query: {
    $allModels: {
      async create({ args, query }) {
        if (args.data.nome) args.data.nome = padronizarTexto(args.data.nome);
        if (args.data.nome) args.data.nome = padronizarTexto(args.data.nome);
        return query(args);
      },
      async update({ args, query }) {
        if (args.data.nome) args.data.nome = padronizarTexto(args.data.nome);
        if (args.data.nome) args.data.nome = padronizarTexto(args.data.nome);
        return query(args);
      },
    },
  },
});
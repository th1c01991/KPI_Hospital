// prisma.config.js
import "dotenv/config"; // Carrega as variáveis do seu arquivo .env

// CORREÇÃO: Usamos "prisma/config" em vez de "@prisma/config"
import { defineConfig, env } from "prisma/config"; 

// Exporta as configurações de conexão para o Prisma
export default defineConfig({
  schema: "prisma/schema.prisma", // Onde está o seu modelo de dados
  datasource: {
    url: env("DATABASE_URL"),     // Sua URL do Postgres
  },
});
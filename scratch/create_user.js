const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const email = "gabrielandrews.me@gmail.com";
  const name = "Gabriel Andrews";
  const tempPassword = "sara-core-temp-" + Math.random().toString(36).slice(-4);
  const password_hash = await bcrypt.hash(tempPassword, 10);

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        is_active: true
      },
      create: {
        email,
        name,
        password_hash,
        is_active: true
      }
    });

    console.log("Usuário criado/atualizado com sucesso!");
    console.log(`Email: ${user.email}`);
    console.log(`Senha temporária: ${tempPassword}`);
    console.log(`Acesso total: ${user.is_active ? "SIM" : "NÃO"}`);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

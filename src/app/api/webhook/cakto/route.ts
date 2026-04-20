import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-cakto-signature"); // Adjust based on Cakto's actual signature header

    // TODO: Verify signature using process.env.CAKTO_WEBHOOK_SECRET
    // if (!isValidSignature(rawBody, signature, process.env.CAKTO_WEBHOOK_SECRET)) {
    //   return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    // }

    const body = JSON.parse(rawBody);

    // Cakto typically sends 'event' and 'data'
    const event = body.event;
    // Pega o email do cliente (isso pode variar dependendo da estrutura exata do payload do Cakto)
    const email = body.data?.customer?.email || body.customer?.email;

    if (!email) {
      return NextResponse.json({ error: "No email provided" }, { status: 400 });
    }

    // Apenas liberar acesso se for pagamento aprovado
    if (event === "payment.approved" || event === "transaction.approved" || event === "invoice.paid") {
      let user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        // Gerar uma senha temporária aleatória e cadastrar
        const tempPassword = Math.random().toString(36).slice(-8);
        const password_hash = await bcrypt.hash(tempPassword, 10);

        user = await prisma.user.create({
          data: {
            email,
            password_hash,
            name: body.data?.customer?.name || body.customer?.name || "Usuário",
            has_access: true,
          }
        });
        
        // Em um cenário real, você enviaria a senha temporária por e-mail no sendWelcomeEmail
        // Ou pediria pro usuário fazer um "recuperar senha" no primeiro acesso.
      } else {
        await prisma.user.update({
          where: { email },
          data: { has_access: true }
        });
      }

      await sendWelcomeEmail(email, process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import mail from "@sendgrid/mail";
import { withApiSession } from "@libs/server/withSession";

mail.setApiKey(process.env.SENDGRID_KEY!);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name, email, password } = req.body;

  if (name && email && password) {
    const user = await client.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      res.status(403).json({
        ok: false,
        error: "メールアドレスは既に使用中です",
      });
    } else {
      const foundToken = await client.token.findUnique({
        where: {
          email,
        },
      });
      if (foundToken) {
        await client.token.deleteMany({ where: { id: foundToken.id } });
      }
      const saltRound = 10;
      const salt = await bcrypt.genSalt(saltRound);
      const hashedPW = await bcrypt.hash(password, salt);
      const payload = Math.floor(100000 + Math.random() * 900000) + "";

      const token = await client.token.create({
        data: {
          payload,
          name,
          email,
          password: hashedPW,
        },
      });
      const sendEmail = await mail.send({
        from: "akwek33@naver.com",
        to: email,
        subject: "Kochi Flavorの認証コード",
        text: `お客様のKochi Flavor認証コード:${payload}`,
        html: `<strong>お客様のKochi Flavor認証コード:${payload}</strong>`,
      });

      res.json({ ok: true });
    }
  }
}

export default withApiSession(
  withHandler({ method: ["POST"], handler, isPrivate: false })
);

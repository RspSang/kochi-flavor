import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;

  if (email && password) {
    const user = await client.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      res.status(403).json({
        ok: false,
        error: "メールアドレスやパスワードが正しくありません",
      });
    }
    const check = await bcrypt.compare(password, user?.password!);
    if (!check) {
      res.status(403).json({
        ok: false,
        error: "メールアドレスやパスワードが正しくありません",
      });
    }
    req.session.user = {
      id: user?.id!,
    };
    await req.session.save();
    res.status(200).json({ ok: true });
  }
}

export default withApiSession(
  withHandler({ method: ["POST"], handler, isPrivate: false })
);

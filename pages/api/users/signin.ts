import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;

  if (email && password) {
    const user = await client.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      res.status(400).json({
        ok: false,
        error: "メールアドレスやパスワードが正しくありません",
      });
    }
    const check = await bcrypt.compare(password, user?.password!);
    if (!check) {
      res.status(400).json({
        ok: false,
        error: "メールアドレスやパスワードが正しくありません",
      });
    }
    res.status(200).end();
  }
}

export default withHandler({ method: ["POST"], handler });

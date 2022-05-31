import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { token } = req.body;
  const foundToken = await client.token.findUnique({
    where: { payload: token },
  });
  if (!foundToken) {
    return res
      .status(404)
      .json({ ok: false, error: "認証コードが正しくありません" });
  }
  const user = await client.user.create({
    data: {
      name: foundToken.name,
      email: foundToken.email,
      password: foundToken.password,
    },
  });
  req.session.user = {
    id: user.id,
  };
  await req.session.save();
  await client.token.deleteMany({ where: { id: foundToken.id } });
  res.json({ ok: true });
}

export default withApiSession(
  withHandler({ method: ["POST"], handler, isPrivate: false })
);

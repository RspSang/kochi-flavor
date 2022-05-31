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
  req.session.user = {
    id: foundToken.userId,
  };
  await req.session.save();
  await client.token.deleteMany({ where: { userId: foundToken.userId } });
  res.json({ ok: true });
}

export default withApiSession(
  withHandler({ method: ["POST"], handler, isPrivate: false })
);

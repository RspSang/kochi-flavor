import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    body: { naviUser },
    session: { user },
    query: { id },
  } = req;
  if (naviUser === user?.id) {
    const deleteReveiw = await client.navi.delete({
      where: { id: +id },
    });
    res.json({ ok: true });
  }
}

export default withApiSession(
  withHandler({ method: ["POST"], handler, isPrivate: false })
);

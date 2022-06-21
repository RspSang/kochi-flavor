import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
  } = req;
  const profile = await client.user.findUnique({
    where: { id: +id.toString() },
    select: {
      id: true,
      avatar: true,
      name: true,
      userDescription: true,
      _count: { select: { reviews: true, wants: true, wents: true } },
    },
  });
  res.json({
    ok: true,
    profile,
  });
}

export default withApiSession(withHandler({ method: ["GET"], handler }));

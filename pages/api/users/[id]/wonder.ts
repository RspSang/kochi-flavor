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
    session: { user },
  } = req;
  const wonders = await client.wondering.findMany({
    where: {
      userId: +id,
    },
    select: {
      naviId: true,
    },
  });
  const wondersNaviId = wonders.map((wonder) => wonder.naviId);
  const navis = await client.navi.findMany({
    where: {
      id: { in: wondersNaviId },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      _count: {
        select: {
          wonderings: true,
          answers: true,
        },
      },
      wonderings: {
        select: {
          userId: true,
        },
        where: {
          userId: user?.id,
        },
      },
    },
    take: 10,
  });

  res.json({ ok: true, navis });
}

export default withApiSession(
  withHandler({ method: ["GET"], handler, isPrivate: false })
);

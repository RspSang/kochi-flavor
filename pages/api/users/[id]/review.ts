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
  const reviews = await client.review.findMany({
    where: {
      userId: +id,
    },
    include: {
      user: {
        select: {
          name: true,
          avatar: true,
          _count: { select: { reviews: true } },
        },
      },
      restaurant: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
      likes: {
        select: {
          userId: true,
        },
      },
    },
  });
  res.json({ ok: true, reviews });
}

export default withApiSession(
  withHandler({ method: ["GET"], handler, isPrivate: false })
);

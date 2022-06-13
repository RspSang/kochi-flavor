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
  const review = await client.review.findMany({
    where: {
      restaurantId: +id.toString(),
    },
    include: {
      user: {
        select: {
          name: true,
          avatar: true,
          _count: {
            select: {
              reviews: true,
            },
          },
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

  res.json({
    ok: true,
    review,
  });
}

export default withApiSession(
  withHandler({ method: ["GET"], handler, isPrivate: false })
);

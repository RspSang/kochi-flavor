import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id, reviewId },
    session: { user },
  } = req;
  const review = await client.review.findUnique({
    where: {
      id: +reviewId.toString(),
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

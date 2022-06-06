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
  const restaurant = await client.restaurant.findUnique({
    where: {
      id: +id.toString(),
    },
    include: {
      reviews: {
        select: {
          id: true,
          review: true,
          user: {
            select: {
              id: true,
              name: true,
              // avatar: true,
              _count: {
                select: {
                  reviews: true,
                },
              },
            },
          },
        },
      },
    },
  });
  res.json({
    ok: true,
    restaurant,
  });
}

export default withApiSession(
  withHandler({ method: ["GET"], handler, isPrivate: false })
);

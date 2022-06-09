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
  const restaurant = await client.restaurant.findUnique({
    where: {
      id: +id.toString(),
    },
    include: {
      reviews: {
        select: {
          id: true,
          review: true,
          restaurantId: true,
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
          user: {
            select: {
              id: true,
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
      },
    },
  });
  const want = Boolean(
    await client.want.findFirst({
      where: {
        restaurantId: +id.toString(),
        userId: user?.id,
      },
      select: {
        id: true,
      },
    })
  );
  const went = Boolean(
    await client.went.findFirst({
      where: {
        restaurantId: +id.toString(),
        userId: user?.id,
      },
      select: {
        id: true,
      },
    })
  );
  res.json({
    ok: true,
    restaurant,
    want,
    went,
  });
}

export default withApiSession(
  withHandler({ method: ["GET"], handler, isPrivate: false })
);

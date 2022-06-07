import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
    query: { id },
  } = req;

  const alreadyExists = await client.went.findFirst({
    where: {
      userId: user?.id,
      restaurantId: +id.toString(),
    },
    select: {
      id: true,
    },
  });
  if (alreadyExists) {
    await client.went.delete({
      where: {
        id: alreadyExists.id,
      },
    });
  } else {
    await client.went.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        restaurant: {
          connect: {
            id: +id.toString(),
          },
        },
      },
    });
  }
  res.json({ ok: true });
}

export default withApiSession(
  withHandler({ method: ["POST"], handler, isPrivate: false })
);

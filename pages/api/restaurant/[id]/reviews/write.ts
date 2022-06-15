import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    body: { review, photoId },
    session: { user },
    query: { id },
  } = req;
  const payload = await client.review.create({
    data: {
      review,
      photo: photoId,
      user: {
        connect: {
          id: user?.id,
        },
      },
      restaurant: {
        connect: {
          id: +id,
        },
      },
    },
  });
  res.json({ ok: true, payload });
}

export default withApiSession(
  withHandler({ method: ["POST"], handler, isPrivate: false })
);

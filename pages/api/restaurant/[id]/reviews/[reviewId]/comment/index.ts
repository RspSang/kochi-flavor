import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    body: { comment },
    session: { user },
    query: { reviewId },
  } = req;
  const payload = await client.comment.create({
    data: {
      comment,
      user: {
        connect: {
          id: user?.id,
        },
      },
      review: {
        connect: {
          id: +reviewId.toString(),
        },
      },
    },
  });
  res.json({ ok: true, payload });
}

export default withApiSession(
  withHandler({ method: ["POST"], handler, isPrivate: false })
);

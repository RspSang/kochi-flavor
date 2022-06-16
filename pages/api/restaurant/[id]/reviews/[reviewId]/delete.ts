import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    body: { reviewUser },
    session: { user },
    query: { reviewId },
  } = req;
  if (reviewUser === user?.id) {
    const deleteReveiw = await client.review.delete({
      where: { id: +reviewId },
    });
    res.json({ ok: true });
  }
}

export default withApiSession(
  withHandler({ method: ["POST"], handler, isPrivate: false })
);

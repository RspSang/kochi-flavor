import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    body: { answerId, answerUserId },
    session: { user },
  } = req;
  console.log(req.body);
  if (answerUserId === user?.id) {
    const deleteAnswer = await client.answer.delete({
      where: {
        id: +answerId,
      },
    });
    res.json({ ok: true });
  }
}

export default withApiSession(
  withHandler({ method: ["POST"], handler, isPrivate: false })
);

import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const profile = await client.user.findUnique({
      where: { id: req.session.user?.id },
    });
    res.json({
      ok: true,
      profile,
    });
  }
  if (req.method === "POST") {
    const {
      session: { user },
      body: { name, userDescription, avatarId },
    } = req;
    const currentUser = await client.user.findUnique({
      where: {
        id: user?.id,
      },
    });
    if (name && name !== currentUser?.name) {
      const alreadyExists = Boolean(
        await client.user.findUnique({
          where: { name },
          select: { id: true },
        })
      );
      if (alreadyExists) {
        return res.json({
          ok: false,
          error: "入力したニックネームは既に使用中です",
        });
      }
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          name,
        },
      });
      res.json({ ok: true });
    }
    if (userDescription) {
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          userDescription,
        },
      });
    }
    if (avatarId) {
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          avatar: avatarId,
        },
      });
    }
    res.json({ ok: true });
  }
}

export default withApiSession(
  withHandler({ method: ["GET", "POST"], handler })
);

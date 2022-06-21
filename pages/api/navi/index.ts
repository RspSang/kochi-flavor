import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "POST") {
    const {
      body: { question },
      session: { user },
    } = req;
    const navi = await client.navi.create({
      data: {
        question,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    res.json({ ok: true, navi });
  }
  if (req.method === "GET") {
    const {
      session: { user },
    } = req;
    const navis = await client.navi.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            wonderings: true,
            answers: true,
          },
        },
        wonderings: {
          select: {
            userId: true,
          },
          where: {
            userId: user?.id,
          },
        },
      },
      take: 10,
    });
    res.json({
      ok: true,
      navis,
    });
  }
}

export default withApiSession(
  withHandler({
    method: ["GET", "POST"],
    handler,
  })
);

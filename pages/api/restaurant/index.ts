import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const restaurants = await client.restaurant.findMany({});
  res.json({
    ok: true,
    restaurants,
  });
}

export default withApiSession(
  withHandler({ method: ["GET"], handler, isPrivate: false })
);

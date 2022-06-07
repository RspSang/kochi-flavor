import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { latitude, longitude },
  } = req;
  const restaurants = await client.$queryRaw`SELECT * , ST_Distance_Sphere(
    point(${longitude}, ${latitude}),
    point(longitude, latitude))/1000 as distance FROM Restaurant ORDER BY distance LIMIT 10`;
  res.json({
    ok: true,
    restaurants,
  });
}

export default withApiSession(
  withHandler({ method: ["GET"], handler, isPrivate: false })
);

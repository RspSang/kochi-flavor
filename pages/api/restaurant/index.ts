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
  const parsedLatitude = parseFloat(latitude.toString());
  const parsedLongitude = parseFloat(longitude.toString());

  const restaurants = await client.restaurant.findMany({
    where: {
      latitude: {
        gte: parsedLatitude - 0.01,
        lte: parsedLatitude + 0.01,
      },
      longitude: {
        gte: parsedLongitude - 0.01,
        lte: parsedLongitude + 0.01,
      },
    },
  });
  res.json({
    ok: true,
    restaurants,
  });
}

export default withApiSession(
  withHandler({ method: ["GET"], handler, isPrivate: false })
);

import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { latitude, longitude, searchText, page },
  } = req;
  const restaurantsCount = await client.restaurant.count();
  if (searchText) {
    const restaurants = await client.$queryRaw`SELECT * , ST_Distance_Sphere(
      point(${longitude}, ${latitude}),
      point(longitude, latitude))/1000 as distance FROM Restaurant WHERE name LIKE ${`%${searchText}%`} ORDER BY distance LIMIT 10 OFFSET ${
      (+page - 1) * 10
    }`;
    res.json({
      ok: true,
      restaurants,
      pages: Math.ceil(restaurantsCount / 10),
    });
  } else {
    const restaurants = await client.$queryRaw`SELECT * , ST_Distance_Sphere(
      point(${longitude}, ${latitude}),
      point(longitude, latitude))/1000 as distance FROM Restaurant ORDER BY distance LIMIT 10 OFFSET ${
        (+page - 1) * 10
      }`;
    res.json({
      ok: true,
      restaurants,
      pages: Math.ceil(restaurantsCount / 10),
    });
  }
}

export default withApiSession(
  withHandler({ method: ["GET"], handler, isPrivate: false })
);

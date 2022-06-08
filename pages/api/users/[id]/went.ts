import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";
import { Prisma } from "@prisma/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { latitude, longitude, id },
  } = req;
  const wentRestaurants = await client.went.findMany({
    where: {
      userId: +id,
    },
  });
  const wentRestaurantsId = wentRestaurants.map(
    (wentRestaurant) => wentRestaurant.restaurantId
  );
  const restaurants = await client.$queryRaw`SELECT * , ST_Distance_Sphere(
    point(${longitude}, ${latitude}),
    point(longitude, latitude))/1000 as distance FROM Restaurant WHERE Restaurant.id IN (${Prisma.join(
      wentRestaurantsId
    )})
    ORDER BY distance LIMIT 10`;
  res.json({ ok: true, restaurants });
}

export default withApiSession(
  withHandler({ method: ["GET"], handler, isPrivate: false })
);

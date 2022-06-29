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
  const wantRestaurants = await client.want.findMany({
    where: {
      userId: +id,
    },
  });
  if (wantRestaurants.length > 0) {
    const wantRestaurantsId = wantRestaurants.map(
      (wantRestaurant) => wantRestaurant.restaurantId
    );
    const restaurants = await client.$queryRaw`SELECT * , ST_Distance_Sphere(
    point(${longitude}, ${latitude}),
    point(longitude, latitude))/1000 as distance FROM Restaurant WHERE Restaurant.id IN (${Prisma.join(
      wantRestaurantsId
    )})
    ORDER BY distance LIMIT 10`;
    res.json({ ok: true, restaurants });
  } else {
    res.json({ ok: true });
  }
}

export default withApiSession(
  withHandler({ method: ["GET"], handler, isPrivate: false })
);

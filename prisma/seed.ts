import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

// const seeds = {data:[]};

async function main() {
  seeds.data.forEach(async (item) => {
    const restaurant = await client.restaurant.create({
      data: {
        name: String(item.name),
        description: String(item.description),
        latitude: String(item.latitude),
        longitude: String(item.longitude),
        image: String(item.photo?.images.original.url),
        location_string: String(item.location_string),
        website: String(item.website),
        phone: String(item.phone),
        address: String(item.address),
      },
    });
  });
}

main()
  .catch((e) => console.log(e))
  .finally(() => client.$disconnect);

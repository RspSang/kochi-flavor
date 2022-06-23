import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();


async function main() {
  seeds.data.forEach(async (item, i) => {
    const restaurant = await client.restaurant.create({
      data: {
        name: String(item.name),
        description: String(item.description),
        latitude: item.latitude ? +item.latitude : null,
        longitude: item.longitude ? +item.longitude : null,
        image: item.photo ? String(item.photo?.images.original.url) : "",
        state: item.address_obj ? String(item.address_obj.state) : "",
        city: item.address_obj ? String(item.address_obj.city) : "",
        street1: item.address_obj ? String(item.address_obj.street1) : "",
        street2: item.address_obj ? String(item.address_obj.street2) : "",
        postalcode: item.address_obj ? String(item.address_obj.postalcode) : "",
        cuisine: item.cuisine ? item.cuisine.map((e) => e.name).toString() : "",
        open_time: item.hours?.week_ranges[0][0]
          ? item.hours.week_ranges[0][0].open_time.toString()
          : "",
        close_time: item.hours?.week_ranges[0][0]
          ? item.hours.week_ranges[0][0].close_time.toString()
          : "",
        website: item.website ? String(item.website) : "",
        phone: String(item.phone),
      },
    });
    console.log(`${i}/500`);
  });
}

main()
  .catch((e) => console.log(e))
  .finally(() => client.$disconnect);

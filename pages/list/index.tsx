import Layout from "@components/layout";
import Card from "@components/card";
import useSWR from "swr";
import useCoords from "@libs/client/useCoords";
import { Restaurant } from "@prisma/client";
import Link from "next/link";

export interface RestaurantWithDistance extends Restaurant {
  distance: number;
}

interface ListResponse {
  ok: boolean;
  restaurants: RestaurantWithDistance[];
}

export default function List() {
  const { latitude, longitude } = useCoords();
  const { data } = useSWR<ListResponse>(
    latitude && longitude
      ? `/api/list?latitude=${latitude}&longitude=${longitude}`
      : null
  );
  return (
    <Layout searchBar hasTabBar>
      {data?.restaurants.map((restaurant) => (
        <Link href={`restaurants/${restaurant.id}`}>
          <a>
            <Card
              name={restaurant.name}
              address={restaurant.address}
              distance={restaurant.distance}
              key={restaurant.id}
            />
          </a>
        </Link>
      ))}
    </Layout>
  );
}

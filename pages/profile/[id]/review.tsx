import type { NextPage } from "next";
import Layout from "@components/layout";
import useCoords from "@libs/client/useCoords";
import useSWR from "swr";
import Link from "next/link";
import Card from "@components/card";
import { RestaurantWithDistance } from "pages/list";

interface WentResponse {
  ok: boolean;
  restaurants: RestaurantWithDistance[];
}

const Review: NextPage = () => {
  const { latitude, longitude } = useCoords();
  const { data } = useSWR<WentResponse>(
    latitude && longitude
      ? `/api/users/me/went?latitude=${latitude}&longitude=${longitude}`
      : null
  );
  return (
    <Layout canGoBack title="行ってきた所">
      {data?.restaurants.map((restaurant) => (
        <Link href={`restaurants/${restaurant.id}`} key={restaurant.id}>
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
};

export default Review;

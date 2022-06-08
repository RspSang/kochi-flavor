import type { NextPage } from "next";
import Layout from "@components/layout";
import useCoords from "@libs/client/useCoords";
import useSWR from "swr";
import Link from "next/link";
import { RestaurantWithDistance } from "pages/list";
import { useRouter } from "next/router";
import RestaurantCard from "@components/restaurant-card";

interface WantResponse {
  ok: boolean;
  restaurants: RestaurantWithDistance[];
}

const Want: NextPage = () => {
  const router = useRouter()
  const { latitude, longitude } = useCoords();
  const { data } = useSWR<WantResponse>(
    latitude && longitude && router.query.id
      ? `/api/users/${router.query.id}/want?latitude=${latitude}&longitude=${longitude}`
      : null
  );
  return (
    <Layout canGoBack title="行きたい所">
      {data?.restaurants?.map((restaurant) => (
        <Link href={`restaurants/${restaurant.id}`} key={restaurant.id}>
          <a>
            <RestaurantCard
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

export default Want;

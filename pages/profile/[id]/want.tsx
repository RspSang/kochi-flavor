import type { NextPage } from "next";
import Layout from "@components/layout";
import useCoords from "@libs/client/useCoords";
import useSWR from "swr";
import Link from "next/link";
import { RestaurantWithDistance } from "pages/list";
import { useRouter } from "next/router";
import RestaurantCard from "@components/restaurant-card";
import Loading from "@components/loading";
import Header from "@components/header";

interface WantResponse {
  ok: boolean;
  restaurants: RestaurantWithDistance[];
}

const Want: NextPage = () => {
  const router = useRouter();
  const { latitude, longitude } = useCoords();
  const { data } = useSWR<WantResponse>(
    latitude && longitude && router.query.id
      ? `/api/users/${router.query.id}/want?latitude=${latitude}&longitude=${longitude}`
      : null
  );
  return (
    <>
      <Header title="行きたい所" />
      <Layout
        canGoBack
        backURL={`/profile/${router.query.id}`}
        title="行きたい所"
      >
        <div className="mt-2">
          {data ? (
            data.restaurants?.map((restaurant) => (
              <Link href={`/restaurants/${restaurant.id}`} key={restaurant.id}>
                <a>
                  <RestaurantCard restaurant={restaurant} />
                </a>
              </Link>
            ))
          ) : (
            <Loading />
          )}
        </div>
      </Layout>
    </>
  );
};

export default Want;

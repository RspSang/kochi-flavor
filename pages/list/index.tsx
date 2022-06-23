import Layout from "@components/layout";
import useSWRInfinite from "swr/infinite";
import useCoords from "@libs/client/useCoords";
import { Restaurant } from "@prisma/client";
import Link from "next/link";
import RestaurantCard from "@components/restaurant-card";
import Loading from "@components/loading";
import { useEffect, useState } from "react";
import { useInfiniteScroll } from "@libs/client/useInfiniteScroll";

export interface RestaurantWithDistance extends Restaurant {
  distance: number;
}

export interface ListResponse {
  ok: boolean;
  restaurants: RestaurantWithDistance[];
  pages: number;
}

export default function List() {
  const { latitude, longitude } = useCoords();
  const page = useInfiniteScroll();
  const [searchText, setSearchText] = useState("");
  const getKey = (pageIndex: number, previousPageData: ListResponse) => {
    if ((pageIndex === 0 && latitude && longitude) || searchText)
      return `/api/list?latitude=${latitude}&longitude=${longitude}&searchText=${searchText}&page=1`;
    if (pageIndex + 1 > previousPageData.pages) return null;
    return `/api/list?latitude=${latitude}&longitude=${longitude}&searchText=${searchText}&page=${
      pageIndex + 1
    }`;
  };
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, setSize } = useSWRInfinite<ListResponse>(getKey, fetcher);
  const restaurants = data ? data.map((item) => item.restaurants).flat() : [];
  useEffect(() => {
    setSize(page);
  }, [setSize, page]);

  return (
    <Layout searchBar hasTabBar setSearchText={setSearchText}>
      <div className="mt-8">
        {data ? (
          restaurants?.map((restaurant) => (
            <Link href={`restaurants/${restaurant.id}`} key={restaurant.id}>
              <a>
                <RestaurantCard restaurant={restaurant} key={restaurant.id} />
              </a>
            </Link>
          ))
        ) : (
          <Loading />
        )}
      </div>
    </Layout>
  );
}

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
    if (latitude && longitude) {
      if (pageIndex === 0) {
        return `/api/list?latitude=${latitude}&longitude=${longitude}&searchText=${searchText}&page=1`;
      }
      if (pageIndex + 1 > previousPageData.pages) return null;
      return `/api/list?latitude=${latitude}&longitude=${longitude}&page=${
        pageIndex + 1
      }`;
    } else return null;
  };
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, mutate, setSize } = useSWRInfinite<ListResponse>(
    getKey,
    fetcher
  );
  const restaurants = data ? data.map((item) => item.restaurants).flat() : [];
  useEffect(() => {
    if (searchText) {
      setSize(1);
    } else {
      setSize(page);
    }
  }, [setSize, page, searchText]);

  useEffect(() => {
    console.log(searchText);
  }, [searchText]);

  return (
    <Layout searchBar hasTabBar setSearchText={setSearchText}>
      <div className="mt-8">
        {data ? (
          restaurants?.map((restaurant) => (
            <Link href={`restaurants/${restaurant.id}`} key={restaurant.id}>
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
  );
}

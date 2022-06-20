import { Restaurant } from "@prisma/client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import useSWR from "swr";
import { RestaurantResponse } from "./map";

interface ReflashProps {
  isMove: boolean;
  setIsMove: Dispatch<SetStateAction<boolean>>;
  setRestaurants: Dispatch<SetStateAction<Restaurant[]>>;
  mapref: any;
}

export default function Reflash({
  isMove,
  setIsMove,
  setRestaurants,
  mapref,
}: ReflashProps) {
  const [coords, setCoords] = useState({ lat: undefined, lng: undefined });
  const onReflashClick = () => {
    if (mapref) {
      setCoords({
        lat: mapref.getCenter().lat(),
        lng: mapref.getCenter().lng(),
      });
      setIsMove(false);
    }
  };
  const { data } = useSWR<RestaurantResponse>(
    coords.lat && coords.lng
      ? `/api/restaurant?latitude=${coords.lat}&longitude=${coords.lng}`
      : null
  );

  useEffect(() => {
    if (data?.ok) {
      setRestaurants(data.restaurants);
    }
  }, [data]);

  return (
    <>
      {isMove ? (
        <div
          onClick={onReflashClick}
          className="fixed w-full max-w-xl top-20 flex justify-center transition ease-in-out delay-150 hover:cursor-pointer z-50"
        >
          <div className="rounded-full bg-white shadow-lg p-2">
            <span className="flex justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              この位置で探す
            </span>
          </div>
        </div>
      ) : null}
    </>
  );
}

import { cls } from "@libs/client/utils";
import Image from "next/image";
import { RestaurantWithDistance } from "pages/list";
import React from "react";

interface RestaurantCardProps {
  restaurant: RestaurantWithDistance;
}

const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
  const clenDistance = (+restaurant.distance.toFixed(2)).toString() + "km";
  const cleanCuisine = restaurant.cuisine.split(",");
  return (
    <div className="px-4 mb-3">
      <div className="flex border-2 shadow-lg rounded-lg h-26 group">
        {restaurant.image ? (
          <div className="relative p-20  object-fill">
            <Image
              className="rounded-l-lg"
              layout="fill"
              src={restaurant.image}
            />
          </div>
        ) : null}
        <div className={cls("py-4 px-4", restaurant.image ? "" : "")}>
          <div className="flex flex-col">
            <span className="text-slate-500">{clenDistance}</span>
            <span className="font-semibold text-2xl group-hover:text-orange-500">
              {restaurant.name}
            </span>
            <span>
              {restaurant.state + restaurant.city + restaurant.street1}
            </span>
            {restaurant.cuisine ? (
              <div className="flex items-center space-x-3">
                <span>種類</span>
                <div className="flex space-x-2">
                  {cleanCuisine.map((cuisine, i) => (
                    <div className="rounded-full bg-slate-200 px-2" key={i}>
                      <span>{cuisine}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(RestaurantCard);

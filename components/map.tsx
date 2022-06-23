import { useEffect, useMemo, useState } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import useCoords from "@libs/client/useCoords";
import mapStyles from "@libs/client/mapStyles";
import useSWR from "swr";
import { Restaurant } from "@prisma/client";
import InfoMarker from "./info-marker";
import Reflash from "./reflash";

const containerStyle = {
  height: "100vh",
  width: "100%",
};

export const defaultMapOptions = {
  clickableIcons: false,
  disableDefaultUI: true,
  styles: mapStyles,
};

export interface RestaurantResponse {
  ok: boolean;
  restaurants: Restaurant[];
}

const Map = () => {
  const { latitude, longitude } = useCoords();
  const center = useMemo(
    () => ({ lat: latitude!, lng: longitude! }),
    [latitude, longitude]
  );
  const [size, setSize] = useState<undefined | google.maps.Size>(undefined);
  const [isMove, setIsMove] = useState(false);
  const [mapref, setMapRef] = useState(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const handleOnLoad = (map: any) => {
    setMapRef(map);
  };
  const createOffsetSize = () => {
    return setSize(new window.google.maps.Size(0, -45));
  };
  const { data } = useSWR<RestaurantResponse>(
    latitude && longitude
      ? `/api/restaurant?latitude=${latitude}&longitude=${longitude}`
      : null
  );

  const onDragEnd = () => {
    setIsMove(true);
  };

  useEffect(() => {
    if (data?.ok) {
      setRestaurants(data.restaurants);
    }
  }, [data]);

  return (
    <div className="absolute w-full h-full top-0 -z-50 max-w-xl">
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY!}
        onLoad={() => createOffsetSize()}
      >
        <GoogleMap
          options={defaultMapOptions}
          mapContainerStyle={containerStyle}
          onLoad={handleOnLoad}
          center={center}
          zoom={17}
          onDragEnd={onDragEnd}
        >
          <Reflash
            isMove={isMove}
            setIsMove={setIsMove}
            setRestaurants={setRestaurants}
            mapref={mapref}
          />
          {data?.ok
            ? restaurants.map((restaurant) => (
                <InfoMarker data={restaurant} key={restaurant.id} />
              ))
            : null}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Map;

import { useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  OverlayView,
} from "@react-google-maps/api";
import useCoords from "@libs/client/useCoords";
import mapStyles from "@libs/client/mapStyles";
import useSWR from "swr";
import { Restaurant } from "@prisma/client";

const containerStyle = {
  height: "100vh",
  width: "100%",
};

const divStyle = {
  background: "white",
  fontSize: 7.5,
};

const defaultMapOptions = {
  clickableIcons: false,
  disableDefaultUI: true,
  styles: mapStyles,
};

interface RestaurantResponse {
  ok: boolean;
  restaurants: Restaurant[];
}

const Map = () => {
  const { latitude, longitude } = useCoords();
  const [size, setSize] = useState<undefined | google.maps.Size>(undefined);
  const createOffsetSize = () => {
    return setSize(new window.google.maps.Size(0, -45));
  };
  const { data } = useSWR<RestaurantResponse>("/api/restaurant");
  return (
    <div className="absolute w-full h-full top-0 -z-50 max-w-xl">
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY!}
        onLoad={() => createOffsetSize()}
      >
        <GoogleMap
          options={defaultMapOptions}
          mapContainerStyle={containerStyle}
          center={{ lat: latitude, lng: longitude }}
          zoom={17}
        >
          {data?.ok
            ? data.restaurants.map((restaurant) => (
                <>
                  <Marker
                    position={{
                      lat: +restaurant.latitude,
                      lng: +restaurant.longitude,
                    }}
                  />
                  <OverlayView
                    position={{
                      lat: +restaurant.latitude,
                      lng: +restaurant.longitude,
                    }}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                  >
                    <div className="bg-slate-100 px-3 py-2 border-orange-500 border-2 rounded-2xl">
                      <h1>{restaurant.name}</h1>
                    </div>
                  </OverlayView>
                </>
              ))
            : null}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Map;

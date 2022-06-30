import { useEffect, useState } from "react";

interface UseCoordState {
  latitude: number | undefined;
  longitude: number | undefined;
}

export default function useCoords() {
  const [coords, setCoords] = useState<UseCoordState>({
    latitude: undefined,
    longitude: undefined,
  });
  const onSuccess = ({
    coords: { latitude, longitude },
  }: GeolocationPosition) => {
    setCoords({ latitude, longitude });
  };
  const onError = () =>
    setCoords({ latitude: 33.5563016, longitude: 133.5260597 });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }, []);

  return coords;
}

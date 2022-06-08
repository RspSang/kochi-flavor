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

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(onSuccess);
  }, []);

  return coords;
}

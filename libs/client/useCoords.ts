import { useEffect, useState } from "react";

interface UseCoordState {
  latitude: number;
  longitude: number;
}

export default function useCoords() {
  const [coords, setCoords] = useState<UseCoordState>({
    latitude: 33.56094658564783,
    longitude: 133.53158095819728,
  });
  const onSuccess = ({
    coords: { latitude, longitude },
  }: GeolocationPosition) => {
    setCoords({ latitude, longitude });
  };
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(onSuccess);
  }, [coords]);

  return coords;
}

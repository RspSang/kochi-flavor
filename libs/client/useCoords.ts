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
    setCoords({ latitude: 33.56094658564783, longitude: 133.53158095819728 });
    navigator.geolocation.getCurrentPosition(onSuccess);
  }, []);

  return coords;
}

import { useState } from "react";
import {
  GoogleMap,
  LoadScript,
  InfoWindow,
  Marker,
} from "@react-google-maps/api";

const containerStyle = {
  height: "100vh",
  width: "100%",
};

const center = {
  lat: 33.56094658564783,
  lng: 133.53158095819728,
};

const positionAkiba = {
  lat: 33.55975751489135,
  lng: 133.531119618254,
};

const positionIwamotocho = {
  lat: 33.558899228071894,
  lng: 133.531645331202,
};

const divStyle = {
  background: "white",
  fontSize: 7.5,
};

const Map = () => {
  const [size, setSize] = useState<undefined | google.maps.Size>(undefined);
  const infoWindowOptions = {
    pixelOffset: size,
  };
  const createOffsetSize = () => {
    return setSize(new window.google.maps.Size(0, -45));
  };
  return (
    <div className="absolute w-full h-full top-0 -z-50 max-w-xl">
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY!}
        onLoad={() => createOffsetSize()}
      >
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={17}>
          <Marker position={positionAkiba} />
          <Marker position={positionIwamotocho} />
          <InfoWindow position={positionAkiba} options={infoWindowOptions}>
            <div style={divStyle}>
              <h1>高知県庁</h1>
            </div>
          </InfoWindow>
          <InfoWindow position={positionIwamotocho} options={infoWindowOptions}>
            <div style={divStyle}>
              <h1>高知市役所</h1>
            </div>
          </InfoWindow>
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Map;

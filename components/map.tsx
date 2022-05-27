import GoogleMapReact from 'google-map-react';

export default function Map() {
  const defaultLatLng = {
    lat: 35.7022589,
    lng: 139.7744733,
  };

  return (
    <div style={{ height: '300px', width: '300px' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY }}
        defaultCenter={defaultLatLng}
        defaultZoom={16}
      />
    </div>
  );
}
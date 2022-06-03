import { Restaurant } from "@prisma/client";
import { Marker, OverlayView } from "@react-google-maps/api";

interface InfoMarkerProps {
  data: Restaurant;
}

const getPixelPositionOffset = (width: number, height: number) => ({
  x: -(width / 2),
  y: -(height / 2) - 40,
});

const InfoMarker = ({
  data: { id, latitude, longitude, name },
}: InfoMarkerProps) => {
  return (
    <div key={id}>
      <Marker
        position={{
          lat: +latitude,
          lng: +longitude,
        }}
      />
      <OverlayView
        position={
          {
            lat: +latitude,
            lng: +longitude,
          } as any
        }
        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        getPixelPositionOffset={getPixelPositionOffset}
      >
        <div className="bg-slate-100 px-2 py-2  border-orange-500 border-2 rounded-2xl cursor-pointer">
          <div className="flex items-center space-x-2">
            <div className="rounded-full bg-orange-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="w-8 h-8 p-2 fill-slate-100"
              >
                <path d="M221.6 148.7C224.7 161.3 224.8 174.5 222.1 187.2C219.3 199.1 213.6 211.9 205.6 222.1C191.1 238.6 173 249.1 151.1 254.1V472C151.1 482.6 147.8 492.8 140.3 500.3C132.8 507.8 122.6 512 111.1 512C101.4 512 91.22 507.8 83.71 500.3C76.21 492.8 71.1 482.6 71.1 472V254.1C50.96 250.1 31.96 238.9 18.3 222.4C10.19 212.2 4.529 200.3 1.755 187.5C-1.019 174.7-.8315 161.5 2.303 148.8L32.51 12.45C33.36 8.598 35.61 5.197 38.82 2.9C42.02 .602 45.97-.4297 49.89 .0026C53.82 .4302 57.46 2.303 60.1 5.259C62.74 8.214 64.18 12.04 64.16 16V160H81.53L98.62 11.91C99.02 8.635 100.6 5.621 103.1 3.434C105.5 1.248 108.7 .0401 111.1 .0401C115.3 .0401 118.5 1.248 120.9 3.434C123.4 5.621 124.1 8.635 125.4 11.91L142.5 160H159.1V16C159.1 12.07 161.4 8.268 163.1 5.317C166.6 2.366 170.2 .474 174.1 .0026C178-.4262 181.1 .619 185.2 2.936C188.4 5.253 190.6 8.677 191.5 12.55L221.6 148.7zM448 472C448 482.6 443.8 492.8 436.3 500.3C428.8 507.8 418.6 512 408 512C397.4 512 387.2 507.8 379.7 500.3C372.2 492.8 368 482.6 368 472V352H351.2C342.8 352 334.4 350.3 326.6 347.1C318.9 343.8 311.8 339.1 305.8 333.1C299.9 327.1 295.2 320 291.1 312.2C288.8 304.4 287.2 296 287.2 287.6L287.1 173.8C288 136.9 299.1 100.8 319.8 70.28C340.5 39.71 369.8 16.05 404.1 2.339C408.1 .401 414.2-.3202 419.4 .2391C424.6 .7982 429.6 2.62 433.9 5.546C438.2 8.472 441.8 12.41 444.2 17.03C446.7 21.64 447.1 26.78 448 32V472z" />
              </svg>
            </div>
            <div className="flex flex-col hover:text-orange-500">
              <span className="text-sm font-semibold">{name}</span>
              <div className="flex space-x-2 text-xs">
                <div className="flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 fill-red-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>5.00</span>
                </div>
                <span>和食</span>
              </div>
            </div>
          </div>
        </div>
      </OverlayView>
    </div>
  );
};

export default InfoMarker;

import type { ReactNode } from "react";
import { MapWrapper } from "../../../src";

type MapProps = {
  children?: ReactNode;
  onReady: () => void;
  onLoadError: (error: Error) => void;
};

const options = { wheelable: true, dragReleaseOnBounds: true, maxScale: 3, minScale: 1, initScale: 1, zoomRatio: 0.1 };

function Map({ children, onReady, onLoadError }: MapProps) {
  return (
    <>
      <MapWrapper
        src="/map.svg"
        className="demo-map"
        options={options}
        onInit={onReady}
        onLoadError={onLoadError}
      >
        {children}
      </MapWrapper>
    </>
  );
}

export default Map;

import '../style.css';
import Zoomist from 'zoomist';
import type { ZoomistOptions } from "zoomist/types";
import { memo, useEffect, useMemo, useRef, type ReactNode } from "react"
import { mapRange, roundTo } from '../utils/coordinates';
import { useMapInternal } from '../context/MapContext';
import { useZoomistEvents } from '../hooks/useZoomistEvents';
import { useSvgSource } from '../hooks/useSvgSource';

export type MapWrapperProps = {
  className?: string,
  onInit? : (zoomist: Zoomist) => void,
  /** 初期化時に適用。変更する場合は key を変えて再マウントする。 */
  options?: ZoomistOptions,
  isDebug?: boolean,
  children?: ReactNode
  onLoadError?: (error: Error) => void,
} & (
  | { src: string; svgHtml?: never }
  | { svgHtml: string | null; src?: never }
);

function MapWrapper({ src, svgHtml, className = '', options, children, onInit, onLoadError, isDebug = false }: MapWrapperProps) {
  const resolvedSvgHtml = useSvgSource(src, svgHtml, onLoadError);
  const { zoomist, setZoomist, resetState } = useMapInternal();
  const zoomistRef = useRef<HTMLDivElement | null>(null);
  const { registerEvents } = useZoomistEvents();
  const ownedInstance = useRef<Zoomist | null>(null);
  const notifiedInstance = useRef<Zoomist | null>(null);
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    if (!resolvedSvgHtml || !zoomistRef.current) return;
    const instance = new Zoomist(zoomistRef.current, optionsRef.current);
    ownedInstance.current = instance;
    const disposeEvents = registerEvents(instance);
    setZoomist(instance);

    return () => {
      disposeEvents();
      instance.destroy(true);
      ownedInstance.current = null;
      notifiedInstance.current = null;
      setZoomist(null);
      resetState();
    };
  }, [resolvedSvgHtml, registerEvents, setZoomist, resetState]);

  useEffect(() => {
    if (!zoomist || zoomist !== ownedInstance.current || notifiedInstance.current === zoomist) return;
    notifiedInstance.current = zoomist;
    onInit?.(zoomist);
  }, [zoomist, onInit]);

  const handleClickContainer = (event: React.MouseEvent) => {
    if(!isDebug) return;
    const container = zoomistRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    const percentX = (offsetX / rect.width) * 100;
    const percentY = (offsetY / rect.height) * 100;

    console.log(`top: ${percentY.toFixed(2)}%; left: ${percentX.toFixed(2)}%;`);

  };

  const handleClickImage = (event: React.MouseEvent) => {
    if (!isDebug) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    const normalizedX = mapRange(offsetX, 0, rect.width, -1, 1);
    const normalizedY = mapRange(offsetY, 0, rect.height, -1, 1);
    const roundedNormalizedX = roundTo(normalizedX, 3);
    const roundedNormalizedY = roundTo(normalizedY, 3);
    console.log(`x: ${roundedNormalizedX}, y: ${-1 * roundedNormalizedY}`);
  };

  return (
    <>
      <div className={`zoomist-container ${className}`} onClick={handleClickContainer} ref={zoomistRef}>
        <div className="zoomist-wrapper">
          <div className="zoomist-image" onClick={handleClickImage}>
            <div dangerouslySetInnerHTML={useMemo(() => {
              return {
                __html: resolvedSvgHtml ?? ''
              };
            }, [resolvedSvgHtml])}></div>
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(MapWrapper);

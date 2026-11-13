import { createNormalizer } from '../utils/coordinates';
import type { Point } from '../types';
import { useCallback } from 'react';
import { useMapInternal } from '../context/MapContext';
import { useInQuadrilateralObserver } from './useInQuadrilateralObserver';

export const useMap = () => {
  const { zoomist, syncState } = useMapInternal();

  const zoomIn = useCallback(() => {
    if (!zoomist) return;
    const currentScale = zoomist.transform.scale;
    zoomist.zoomTo(Math.min(currentScale + 1, zoomist.options.maxScale || 5));
  }, [zoomist]);

  const zoomOut = useCallback(() => {
    if (!zoomist) return;
    const currentScale = zoomist.transform.scale;
    zoomist.zoomTo(Math.max(currentScale - 1, zoomist.options.minScale || 1));
  }, [zoomist]);

  const focusTo = useCallback((transform: Point, scale: number = 2) => {
    if (!zoomist) return;
    zoomist.zoomTo(scale);

    const normalizer = createNormalizer(zoomist);
    if (!normalizer) return;
    const { x: normX, y: normY } = normalizer.toPixel(transform.x, transform.y);
    zoomist.moveTo({
      x: normX,
      y: normY
    });
    // moveTo() 自体はイベントを発火しないため、移動後に同期する。
    syncState(zoomist);
  }, [zoomist, syncState]);

  return {
    zoomIn,
    zoomOut,
    focusTo,
    useInQuadrilateralObserver
  }
}

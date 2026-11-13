import type Zoomist from 'zoomist';
import { useCallback } from 'react';
import { useMapInternal } from '../context/MapContext';

export const useZoomistEvents = (): {
  registerEvents: (zoomist: Zoomist) => () => void;
} => {
  const { setState, syncState } = useMapInternal();

  const registerEvents = useCallback((zoomist: Zoomist) => {
    let active = true;
    let pinchEndTimer: ReturnType<typeof setTimeout> | undefined;
    const sync = () => {
      if (active) syncState(zoomist);
    };

    zoomist.on('zoom', sync);
    zoomist.on('drag', sync);
    zoomist.on('resize', sync);
    zoomist.on('reset', sync);
    zoomist.on('pinchStart', () => {
      if (!active) return;
      clearTimeout(pinchEndTimer);
      setState((state) => ({ ...state, isPinching: true }));
    });
    zoomist.on('pinchEnd', () => {
      if (!active) return;
      clearTimeout(pinchEndTimer);
      pinchEndTimer = setTimeout(() => {
        if (active) setState((state) => ({ ...state, isPinching: false }));
      }, 50);
    });
    sync();

    // Zoomist 2.x に off() はないため、所有インスタンスの destroy() と併用する。
    return () => {
      active = false;
      clearTimeout(pinchEndTimer);
    };
  }, [setState, syncState]);

  return { registerEvents };
};

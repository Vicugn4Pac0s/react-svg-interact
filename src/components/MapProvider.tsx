import { useCallback, useMemo, useState, type ReactNode } from 'react';
import type Zoomist from 'zoomist';
import { MapInternalContext, MapStateContext } from '../context/MapContext';
import type { MapState } from '../types';
import { createNormalizer } from '../utils/coordinates';

const initialState: MapState = { center: { x: 0, y: 0 }, scale: 1, isPinching: false };

/** 1つの Provider につき1つの MapWrapper を配置する。 */
export function MapProvider({ children }: { children: ReactNode }) {
  const [zoomist, setZoomist] = useState<Zoomist | null>(null);
  const [state, setState] = useState(initialState);

  const syncState = useCallback((instance: Zoomist) => {
    const normalizer = createNormalizer(instance);
    if (!normalizer) return;
    const { translateX, translateY, scale } = instance.transform;
    const center = normalizer.toNormalized(translateX, translateY);
    setState((previous) => {
      if (previous.scale === scale && previous.center.x === center.x && previous.center.y === center.y) {
        return previous;
      }
      return { ...previous, center, scale };
    });
  }, []);
  const resetState = useCallback(() => setState(initialState), []);
  const internal = useMemo(
    () => ({ zoomist, setZoomist, setState, syncState, resetState }),
    [zoomist, syncState, resetState],
  );

  return (
    <MapInternalContext.Provider value={internal}>
      <MapStateContext.Provider value={state}>
        {children}
      </MapStateContext.Provider>
    </MapInternalContext.Provider>
  );
}

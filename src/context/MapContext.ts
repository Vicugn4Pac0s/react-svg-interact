import { createContext, useContext, useMemo, type Dispatch, type SetStateAction } from 'react';
import type Zoomist from 'zoomist';
import type { MapState } from '../types';

export const MapStateContext = createContext<MapState | null>(null);
export const MapInternalContext = createContext<{
  zoomist: Zoomist | null;
  setZoomist: Dispatch<SetStateAction<Zoomist | null>>;
  setState: Dispatch<SetStateAction<MapState>>;
  syncState: (zoomist: Zoomist) => void;
  resetState: () => void;
} | null>(null);

export function useMapInstance() {
  const context = useContext(MapInternalContext);
  const instance = useMemo(() => ({ zoomist: context?.zoomist ?? null }), [context?.zoomist]);
  if (!context) throw new Error('useMapInstance must be used within MapProvider.');
  return instance;
}

export function useMapInternal() {
  const context = useContext(MapInternalContext);
  if (!context) throw new Error('useMapInternal must be used within MapProvider.');
  return context;
}

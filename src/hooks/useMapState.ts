import { useContext } from 'react';
import { MapStateContext } from '../context/MapContext';

export function useMapState() {
  const context = useContext(MapStateContext);
  if (!context) throw new Error('useMapState must be used within MapProvider.');
  return context;
}

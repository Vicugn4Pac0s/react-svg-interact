import { useMap, useMapState } from '../../../src';
import { Icon } from './Icon';

export function MapControls({ disabled }: { disabled: boolean }) {
  const { zoomIn, zoomOut, focusTo } = useMap();
  const { scale } = useMapState();

  return (
    <div className="map-controls" aria-label="マップ操作">
      <button className="icon-button" onClick={zoomIn} disabled={disabled || scale >= 3} aria-label="拡大" title="拡大"><Icon name="plus" /></button>
      <span className="zoom-value" aria-live="polite">{Math.round(scale * 100)}%</span>
      <button className="icon-button" onClick={zoomOut} disabled={disabled || scale <= 1} aria-label="縮小" title="縮小"><Icon name="minus" /></button>
      <span className="control-divider" />
      <button className="icon-button" onClick={() => focusTo({ x: 0, y: 0 }, 1)} disabled={disabled} aria-label="マップを全体表示" title="全体表示"><Icon name="reset" /></button>
    </div>
  );
}

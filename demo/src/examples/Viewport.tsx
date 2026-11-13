import { useMap } from '../../../src';
import { ExampleLayout } from '../components/ExampleLayout';

const code = `const { zoomIn, zoomOut, focusTo } = useMap();
const { center, scale, isPinching } = useMapState();

<button onClick={zoomIn}>Zoom in</button>
<button onClick={zoomOut}>Zoom out</button>
<button onClick={() => focusTo({ x: 0.56, y: -0.063 }, 2)}>
  Focus C
</button>
<button onClick={() => focusTo({ x: 0, y: 0 }, 1)}>
  Reset
</button>`;

export function Viewport() {
  const { zoomIn, zoomOut, focusTo } = useMap();
  return (
    <ExampleLayout code={code} state={{}} controls={<>
      <p className="control-help">ドラッグ・ホイール・ピンチ操作に加え、フックからもビューを操作できます。現在値は下の state に反映されます。</p>
      <div className="button-grid"><button className="secondary-button" onClick={zoomIn}>Zoom in</button><button className="secondary-button" onClick={zoomOut}>Zoom out</button></div>
      <span className="section-label">FOCUS TO</span>
      <div className="button-grid">
        <button className="secondary-button" onClick={() => focusTo({ x: -0.56, y: 0.188 }, 2)}>Marker A</button>
        <button className="secondary-button" onClick={() => focusTo({ x: 0, y: 0.438 }, 2)}>Marker B</button>
        <button className="secondary-button" onClick={() => focusTo({ x: 0.56, y: -0.063 }, 2)}>Marker C</button>
        <button className="secondary-button" onClick={() => focusTo({ x: 0, y: 0 }, 1)}>Reset view</button>
      </div>
    </>} />
  );
}

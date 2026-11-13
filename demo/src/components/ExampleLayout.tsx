import { useState, type ReactNode } from 'react';
import { useMapState } from '../../../src';
import Map from './Map';
import { MapControls } from './MapControls';

type ExampleLayoutProps = {
  children?: ReactNode;
  controls: ReactNode;
  state: object;
  code: string;
};

const setup = `import 'react-svg-interact/style.css';
import { MapProvider, MapWrapper, SvgElement, SvgElements } from 'react-svg-interact';

<MapProvider>
  <MapWrapper src="/map.svg">
    {/* 各サンプルの SvgElement / SvgElements を配置 */}
  </MapWrapper>
  {/* useMap() を使う操作パネルも Provider 配下へ */}
</MapProvider>`;

function StateInspector({ value }: { value: object }) {
  const { center, scale, isPinching } = useMapState();
  return (
    <details className="inspector">
      <summary>React state を見る</summary>
      <pre>{JSON.stringify({ ...value, viewport: { center, scale, isPinching } }, null, 2)}</pre>
    </details>
  );
}

export function ExampleLayout({ children, controls, state, code }: ExampleLayoutProps) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapKey, setMapKey] = useState(0);

  return (
    <>
      <div className="example-grid">
        <section className="preview-card">
          <div className="card-heading"><span>SVG PREVIEW</span><code>map.svg</code></div>
          <div className="preview-canvas">
            <Map key={mapKey} onReady={() => setReady(true)} onLoadError={(cause) => { setError(cause.message); setReady(false); }}>{children}</Map>
            {!ready && (
              <div className="loading-overlay" role={error ? 'alert' : 'status'}>
                {error ? <><strong>SVG を取得できませんでした</strong><span>{error}</span><button className="secondary-button" onClick={() => { setError(null); setMapKey((current) => current + 1); }}>再試行</button></> : 'Loading SVG…'}
              </div>
            )}
            <MapControls disabled={!ready} />
          </div>
          <div className="preview-caption"><span>ドラッグで移動 / ホイール・ピンチでズーム</span><span className="ready-badge">{ready ? '● Ready' : '○ Loading'}</span></div>
        </section>
        <aside className="control-card">
          <div className="card-heading">REACT UI</div>
          <fieldset disabled={!ready} className="controls-content">{controls}</fieldset>
          <StateInspector value={state} />
        </aside>
      </div>
      <section className="source-card"><div className="card-heading"><span>この動きの実装</span><code>React / TSX</code></div><pre><code>{code}</code></pre></section>
      <details className="setup-details"><summary>共通のセットアップを見る</summary><pre><code>{setup}</code></pre></details>
    </>
  );
}

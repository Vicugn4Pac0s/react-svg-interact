import { useState } from 'react';
import { MapProvider } from '../../src';
import { Icon } from './components/Icon';
import { SingleElement } from './examples/SingleElement';
import { MultipleElements } from './examples/MultipleElements';
import { Events } from './examples/Events';
import { DataBinding } from './examples/DataBinding';
import { Viewport } from './examples/Viewport';

const examples = [
  { id: 'events', title: 'マーカーとUIを連動させる', api: 'Events + SvgElements', description: 'SVGのマーカー、または右のA・B・Cを選択。同じIDのエリア・経路・ReactのUIが一緒に変わります。', Component: Events },
  { id: 'single', title: '色・表示を切り替える', api: 'SvgElement', description: '右のカラーピッカーやチェックボックスを操作。Area Aの色と表示がReactのstateに合わせて変わります。', Component: SingleElement },
  { id: 'multiple', title: '複数の要素をまとめて変える', api: 'SvgElements', description: 'スライダーで全エリアの透明度を変更。Area Bだけを強調すると、要素ごとに異なるスタイルが適用されます。', Component: MultipleElements },
  { id: 'data', title: 'データで有効・無効を切り替える', api: 'React state → SVG', description: 'IDごとのチェックを切り替え。同じIDのエリア・経路・マーカーがまとめて薄くなり、非表示にもできます。', Component: DataBinding },
  { id: 'viewport', title: '指定した場所にズームする', api: 'useMap / useMapState', description: '右のA・B・Cボタンから対象の位置へズーム。ドラッグやホイールで動かした位置と倍率もstateから参照できます。', Component: Viewport },
] as const;

export default function App() {
  const [activeId, setActiveId] = useState<string>('events');
  const example = examples.find((item) => item.id === activeId) ?? examples[0];
  const Component = example.Component;

  return (
    <div className="demo-shell">
      <header className="site-header">
        <a href="./" className="brand"><span className="brand-icon"><Icon name="layers" /></span>React SVG Interact<span className="demo-badge">DEMO</span></a>
        <span className="header-meta">React + Zoomist</span>
      </header>
      <section className="demo-intro" aria-labelledby="demo-intro-title">
        <div className="intro-copy">
          <span className="intro-eyebrow">INTERACTIVE EXAMPLES</span>
          <h1 id="demo-intro-title">既存のSVGを、Reactでインタラクティブに。</h1>
          <p>色や表示の切り替え、クリックへの反応、データ連動、ズーム。動くSVGと実装コードで試せます。</p>
        </div>
      </section>
      <div className="docs-layout">
        <aside className="navigation">
          <div className="section-label">EXAMPLES</div>
          <nav aria-label="機能別サンプル">
            {examples.map((item, index) => (
              <button key={item.id} aria-current={activeId === item.id ? 'page' : undefined} onClick={() => setActiveId(item.id)}>
                <span className="nav-number">0{index + 1}</span><span>{item.title}<code>{item.api}</code></span>
              </button>
            ))}
          </nav>
          <div className="nav-note">各サンプルは独立した<br /><code>MapProvider</code> で動作します。</div>
        </aside>
        <main className="example-main">
          <p className="breadcrumb">Examples <span>/</span> {example.api}</p>
          <h2>{example.title}</h2>
          <p className="example-description">{example.description}</p>
          <MapProvider key={example.id}><Component /></MapProvider>
        </main>
      </div>
      <footer className="site-footer"><span>React SVG Interact / Developer examples</span><span>デモのソース: <code>demo/src/examples/</code></span></footer>
    </div>
  );
}

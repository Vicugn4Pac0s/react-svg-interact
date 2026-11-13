import { useState } from 'react';
import { SvgElements } from '../../../src';
import { ExampleLayout } from '../components/ExampleLayout';

const code = `const [hoveredId, setHoveredId] = useState<string | null>(null);
const [selectedId, setSelectedId] = useState<string | null>('b');
const activeId = hoveredId ?? selectedId;

// Reactのボタンからも同じstateを更新
{['a', 'b', 'c'].map((id) => (
  <button key={id} onClick={() => setSelectedId(id)}>
    Area {id.toUpperCase()}
  </button>
))}

<SvgElements
  selector=".marker"
  onPointerEnter={(e) => setHoveredId(e.currentTarget.dataset.id ?? null)}
  onPointerLeave={() => setHoveredId(null)}
  onClick={(e) => setSelectedId(e.currentTarget.dataset.id ?? null)}
/>

<SvgElements
  selector=".region"
  style={(el) => ({
    opacity: activeId && el.dataset.id !== activeId ? 0.35 : 1,
  })}
/>

<SvgElements
  selector=".route"
  style={(el) => ({
    stroke: el.dataset.id === activeId ? '#6366f1' : undefined,
    opacity: el.dataset.id === activeId ? 1 : 0.2,
  })}
/>`;

export function Events() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>('b');
  const [log, setLog] = useState<string[]>([]);
  const activeId = hoveredId ?? selectedId;
  const record = (type: string, id: string | null) => setLog((current) => [`${type} → ${id ?? 'null'}`, ...current].slice(0, 5));

  return (
    <ExampleLayout
      code={code}
      state={{ hoveredId, selectedId }}
      controls={<>
        <p className="control-help">ここから選んでも、SVGのマーカーから選んでも、同じstateを更新します。</p>
        <div className="area-options" role="group" aria-label="エリアを選択">
          {['a', 'b', 'c'].map((id) => (
            <button key={id} className={`area-option${activeId === id ? ' is-active' : ''}`} aria-pressed={selectedId === id} onClick={() => { setSelectedId(id); record('React click', id); }}>
              <span className="area-letter">{id.toUpperCase()}</span><span>Area {id.toUpperCase()}<code>data-id="{id}"</code></span><span className="area-status">{selectedId === id ? '選択中' : hoveredId === id ? 'ホバー中' : '選択'}</span>
            </button>
          ))}
        </div>
        <div className="selection-result" role="status">
          <span className="section-label">SVG → REACT STATE → SVG</span>
          <code>selectedId = {JSON.stringify(selectedId)}</code>
          <p>{activeId ? `Area ${activeId.toUpperCase()} と対応する経路を強調中` : 'A・B・Cのどれかを選んでください'}</p>
        </div>
        <button className="secondary-button" onClick={() => { setSelectedId(null); setHoveredId(null); setLog([]); }}>選択・ログをクリア</button>
        <details className="event-log"><summary>イベントログを見る</summary><div>{log.length ? log.map((entry, index) => <code key={index}>{entry}</code>) : <span>イベントを待っています</span>}</div></details>
      </>}
    >
      <SvgElements selector=".region" style={(element) => ({ opacity: activeId && element.dataset.id !== activeId ? 0.35 : 1 })} />
      <SvgElements selector=".route" style={(element) => ({ stroke: element.dataset.id === activeId ? '#6366f1' : undefined, opacity: element.dataset.id === activeId ? 1 : 0.2 })} />
      <SvgElements
        selector=".marker"
        style={(element) => ({ cursor: 'pointer', color: element.dataset.id === selectedId ? '#4338ca' : element.dataset.id === hoveredId ? '#f97316' : '#64748b' })}
        onPointerEnter={(event) => { const id = event.currentTarget.dataset.id ?? null; setHoveredId(id); record('pointerenter', id); }}
        onPointerLeave={() => { setHoveredId(null); record('pointerleave', null); }}
        onFocus={(event) => { const id = event.currentTarget.dataset.id ?? null; setHoveredId(id); record('focus', id); }}
        onBlur={() => setHoveredId(null)}
        onMouseDown={(event) => event.stopPropagation()}
        onTouchStart={(event) => event.stopPropagation()}
        onClick={(event) => { const id = event.currentTarget.dataset.id ?? null; setSelectedId(id); record('click', id); }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            const id = event.currentTarget.dataset.id ?? null;
            setSelectedId(id);
            record('keydown', id);
          }
        }}
      />
    </ExampleLayout>
  );
}

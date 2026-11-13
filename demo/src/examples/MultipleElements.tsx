import { useState } from 'react';
import { SvgElements } from '../../../src';
import { ExampleLayout } from '../components/ExampleLayout';

const code = `const [opacity, setOpacity] = useState(1);
const [highlightB, setHighlightB] = useState(false);

<SvgElements
  selector=".region"
  style={(element) => ({
    opacity,
    fill: highlightB
      ? element.dataset.id === 'b' ? '#c7d2fe' : '#e2e8f0'
      : undefined,
  })}
/>`;

export function MultipleElements() {
  const [opacity, setOpacity] = useState(1);
  const [highlightB, setHighlightB] = useState(false);
  return (
    <ExampleLayout
      code={code}
      state={{ opacity, highlightB }}
      controls={<>
        <p className="control-help"><code>.region</code> に一致する全要素が対象です。関数を渡すと、要素ごとにスタイルを変えられます。</p>
        <label className="range-label"><span>不透明度<output>{opacity.toFixed(1)}</output></span><input type="range" min="0.1" max="1" step="0.1" value={opacity} onChange={(event) => setOpacity(Number(event.target.value))} /></label>
        <label className="control-row">B だけを強調<input type="checkbox" checked={highlightB} onChange={(event) => setHighlightB(event.target.checked)} /></label>
      </>}
    >
      <SvgElements selector=".region" style={(element) => ({ opacity, fill: highlightB ? element.dataset.id === 'b' ? '#c7d2fe' : '#e2e8f0' : undefined })} />
    </ExampleLayout>
  );
}

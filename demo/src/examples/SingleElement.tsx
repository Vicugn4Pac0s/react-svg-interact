import { useState } from 'react';
import { SvgElement } from '../../../src';
import { ExampleLayout } from '../components/ExampleLayout';

const code = `const [fill, setFill] = useState('#c7d2fe');
const [visible, setVisible] = useState(true);

<SvgElement
  selector="#region-a"
  style={{ fill, display: visible ? undefined : 'none' }}
/>`;

export function SingleElement() {
  const [fill, setFill] = useState('#c7d2fe');
  const [visible, setVisible] = useState(true);

  return (
    <ExampleLayout
      code={code}
      state={{ fill, visible }}
      controls={<>
        <p className="control-help"><code>#region-a</code> だけにスタイルを適用します。他のエリアは変化しません。</p>
        <label className="control-row">塗り色<input type="color" value={fill} onChange={(event) => setFill(event.target.value)} /></label>
        <label className="control-row">要素を表示<input type="checkbox" checked={visible} onChange={(event) => setVisible(event.target.checked)} /></label>
        <button className="secondary-button" onClick={() => { setFill('#c7d2fe'); setVisible(true); }}>初期値に戻す</button>
      </>}
    >
      <SvgElement selector="#region-a" style={{ fill, display: visible ? undefined : 'none' }} />
    </ExampleLayout>
  );
}

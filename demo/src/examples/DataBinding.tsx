import { useState } from 'react';
import { SvgElements } from '../../../src';
import { ExampleLayout } from '../components/ExampleLayout';

const initialData = [{ id: 'a', enabled: true }, { id: 'b', enabled: false }, { id: 'c', enabled: true }];
const code = `const [data, setData] = useState([
  { id: 'a', enabled: true },
  { id: 'b', enabled: false },
  { id: 'c', enabled: true },
]);
const [hideDisabled, setHideDisabled] = useState(false);

<SvgElements
  selector="[data-id]"
  style={(element) => {
    const item = data.find((item) => item.id === element.dataset.id);
    const disabled = item?.enabled === false;
    return {
      display: disabled && hideDisabled ? 'none' : undefined,
      opacity: disabled ? 0.2 : 1,
    };
  }}
/>`;

export function DataBinding() {
  const [data, setData] = useState(initialData);
  const [hideDisabled, setHideDisabled] = useState(false);
  return (
    <ExampleLayout
      code={code}
      state={{ data, hideDisabled }}
      controls={<>
        <p className="control-help">API の取得結果を想定した配列です。同じ <code>data-id</code> のエリア・経路・マーカーが一緒に更新されます。</p>
        {data.map((item) => (
          <label className="control-row" key={item.id}>
            <code>id: "{item.id}"</code>
            <input type="checkbox" checked={item.enabled} onChange={() => setData((current) => current.map((entry) => entry.id === item.id ? { ...entry, enabled: !entry.enabled } : entry))} />
          </label>
        ))}
        <label className="control-row">無効な要素は非表示にする<input type="checkbox" checked={hideDisabled} onChange={(event) => setHideDisabled(event.target.checked)} /></label>
        <button className="secondary-button" onClick={() => { setData(initialData); setHideDisabled(false); }}>データをリセット</button>
      </>}
    >
      <SvgElements selector="[data-id]" style={(element) => {
        const disabled = data.find((item) => item.id === element.dataset.id)?.enabled === false;
        return { display: disabled && hideDisabled ? 'none' : undefined, opacity: disabled ? 0.2 : 1 };
      }} />
    </ExampleLayout>
  );
}

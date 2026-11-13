# React SVG Interact

## 開発構成

ライブラリ本体は `src/`、利用例は `demo/` に配置しています。

```text
src/
├─ index.ts          # 公開 API
├─ types.ts
├─ style.css
├─ components/
├─ context/
├─ hooks/
└─ utils/
demo/
├─ index.html
├─ public/map.svg
└─ src/
   ├─ main.tsx
   ├─ App.tsx
   ├─ index.css
   └─ components/
```

- `npm run dev`：デモを起動。本体ソースの変更も反映します。
- `npm run build`：ES Modules・CSS・型定義を `dist/` に出力します。
- `npm run build:demo`：デモを `dist-demo/` に出力します。
- `npm run preview`：ビルド済みデモを表示します。

デモは `src/index.ts` の公開 API を相対パスで参照します。
デモページは開発者向けの機能別サンプル集です。各サンプルで SVG プレビュー、操作パネル、
現在の state、使用コードを確認できます。

- 単体要素：`SvgElement` による色・表示の変更
- 複数要素：`SvgElements` による一括・要素別スタイルの指定
- イベント：ホバー・クリック・キー入力と、関連要素の連動
- データ連動：ID を持つ配列による要素の無効化・非表示
- ビュー操作：`useMap` と `useMapState` によるズーム・フォーカス・状態参照

サンプルの実装は `demo/src/examples/` にあります。SVG は A・B・C のエリア・経路・マーカーで
構成し、共通の `data-id` 属性で関連付けています。サンプルの切り替え時には Provider も切り替えます。

配布パッケージから利用する場合は、CSS を一度読み込んでください。

```tsx
import 'react-svg-interact/style.css';
import { MapProvider, MapWrapper, SvgElement, SvgElements } from 'react-svg-interact';
```

**React SVG Interact** は、Zoomistと連携してSVGマップ上でのズーム・パン・フォーカス・選択・状態監視を可能にする軽量なReact支援ライブラリです。
SVG要素へのインタラクションや状態管理を、シンプルで柔軟なAPIとして提供します。

---

## 🚀 主な機能

### 🧠 本体機能（状態・メソッド・イベント）

| 分類 | 機能名 | 概要 |
|----------|--------------|------------|
| **状態管理（Context）** | `zoomist` | MapProvider ごとに Zoomist インスタンスを管理する。`useMapInstance()` で参照できる |
|  | `center` | 現在の中央座標（正規化された値） |
|  | `scale` | 現在のズーム倍率 |
|  | `isPinching` | ピンチ操作中かどうかを示すフラグ |
| **メソッド** | `zoomIn()` | マップを拡大する |
|  | `zoomOut()` | マップを縮小する |
|  | `focusTo(point, scale)` | 指定座標へ移動しズームする |
| **イベント** | `useInQuadrilateralObserver()` | 四角形領域への進入／退出を検知するカスタムフック |
| **コンポーネント** | `SvgElement` | セレクターに一致する最初の SVG 要素のスタイル・イベントを制御する |
|  | `SvgElements` | セレクターに一致するすべての SVG 要素のスタイル・イベントを制御する |

---

## 🧩 使用例

### SVG ファイルの参照

`src` に SVG ファイルの URL を指定できます。取得した SVG はインラインで描画するため、
`SvgElement`・`SvgElements` によるスタイル変更やイベントも利用できます。

```tsx
<MapProvider>
  <MapWrapper src="/map.svg" onLoadError={(error) => console.error(error)}>
    <SvgElements
      selector=".marker"
      style={{ cursor: 'pointer' }}
      onClick={(event) => setSelectedId(event.currentTarget.id)}
    />
  </MapWrapper>
</MapProvider>
```

- デモの `demo/public/map.svg` は `/map.svg` で参照できます。
- `src` と既存の `svgHtml` は、どちらか一方を指定してください。
- URL を変更すると再取得し、前の取得は中止します。アンマウント時も取得を中止します。
- HTTP エラー・通信エラーは `onLoadError` に通知します。省略時はコンソールに出力します。
- 別ドメインから読み込む場合は、配信元の CORS 設定が必要です。

### 外部 UI と SVG 要素の連動

`SvgElement` と `SvgElements` は DOM を追加せず、同じ `MapProvider` 内の
`MapWrapper` に読み込まれた SVG を操作します。`MapWrapper` の children として配置できます。

```tsx
import { useState } from 'react';
import { MapProvider, MapWrapper, SvgElement, SvgElements } from 'react-svg-interact';

function InteractiveMap({ svg }: { svg: string }) {
  const [visible, setVisible] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  return (
    <MapProvider>
      <button onClick={() => setVisible((value) => !value)}>マーカー切り替え</button>
      <button onClick={() => setSelectedIds(['a'])}>エリア A を選択</button>
      <MapWrapper svgHtml={svg}>
        <SvgElement selector="#marker-a" style={{ opacity: visible ? 1 : 0 }} />
        <SvgElements
          selector=".region"
          style={(element) => ({
            opacity: selectedIds.includes(element.dataset.id ?? '') ? 1 : 0.2,
          })}
        />
      </MapWrapper>
    </MapProvider>
  );
}
```

- `selector` は CSS セレクターです。単体用は最初の一致、複数用は全一致を対象とします。
- `style` は React の `CSSProperties`、または `(element: SVGElement, index: number) => CSSProperties` です。
- 独自データや選択状態は React の state で管理し、スタイル関数内で条件を判定します。
- SVG の読み込み完了後に適用します。SVG の差し替え時にも再適用します。
- props の更新、対象変更、アンマウント時には、前回適用したスタイルを元の値へ戻します。
- 同じ要素の同じスタイルプロパティは、1つのコンポーネントで管理してください。
- デモの区間表示もこの方式を使用しています。

### SVG 要素のホバー・クリック

両コンポーネントはイベント用 props に対応しています。`style` を省略し、イベントだけを登録することもできます。

```tsx
const [hoveredId, setHoveredId] = useState<string | null>(null);
const [selectedId, setSelectedId] = useState<string | null>(null);

<SvgElements
  selector=".marker"
  style={(element) => ({
    cursor: 'pointer',
    opacity: element.id === hoveredId || element.id === selectedId ? 1 : 0.5,
  })}
  onPointerEnter={(event) => setHoveredId(event.currentTarget.id)}
  onPointerLeave={() => setHoveredId(null)}
  onClick={(event) => setSelectedId(event.currentTarget.id)}
  onKeyDown={(event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setSelectedId(event.currentTarget.id);
    }
  }}
/>
```

- 対応イベント：クリック・ダブルクリック・コンテキストメニュー、ポインター、マウス、タッチ、キー入力、フォーカス・ブラー、ホイール。
- 例えば `onClick`、`onDoubleClick`、`onPointerEnter`、`onPointerLeave`、`onPointerDown`、`onPointerMove`、`onPointerUp`、`onMouseEnter`、`onMouseLeave`、`onTouchStart`、`onKeyDown`、`onFocus`、`onBlur` を指定できます。
- 渡されるのは DOM のネイティブイベントです。`currentTarget` はセレクターに一致した SVG 要素で、`target` は実際に操作した子要素を指す場合があります。
- `preventDefault()`・`stopPropagation()` を使用できます。イベントの伝播は自動では止めません。
- `onFocus`・`onBlur` は対象要素自身のフォーカスを監視します。キー入力やフォーカスを使うマーカーには、元の SVG で `tabindex="0"` などを設定してください。
- イベントは SVG の読み込み後に登録し、props 更新・SVG 差し替え・アンマウントに合わせて登録し直すか解除します。

`Map` と操作パネルは同じ `MapProvider` 配下に配置します。1つの Provider に
1つの `MapWrapper` を配置してください。複数のマップはそれぞれ別の Provider で囲みます。

```tsx
import { MapProvider, MapWrapper, useMap, useMapState } from 'react-svg-interact';

function App() {
  return (
    <MapProvider>
      <Map />
      <MapController />
      <MapStatus />
    </MapProvider>
  );
}

function MapStatus() {
  const { center, scale, isPinching } = useMapState();
  return <p>{center.x}, {center.y} / {scale} / {String(isPinching)}</p>;
}
```

マップの状態は `useMapState()`、ズーム・フォーカス操作は `useMap()` で取得します。
インスタンスと内部管理用メソッドを持つ `MapInternalContext`、表示用の状態を持つ
`MapStateContext` の2つに分離し、操作だけを使うコンポーネントは
中心座標や倍率の更新を購読しません。各フックは Provider 配下で使用してください。

`MapWrapper` は SVG の差し替え時にインスタンスを作り直し、アンマウント時に破棄します。
`options` は初期化時に適用されます。動的に変更する場合は `MapWrapper` の `key` を変更して
再マウントしてください。`onInit` は初期化後、Context からインスタンスを参照できる状態で呼ばれます。

### Mapコンポーネントの作成

```tsx
const svg = `<svg>...</svg>`

function Map({ children }: { children?: ReactNode }) {
  const [svgHtml, setSvgHtml] = useState<string | null>(svg); // 非同期の場合,setSvgHtmlで設定する

  return (
    <>
      <MapWrapper
        svgHtml={svgHtml}
        className=""
        options={{
          wheelable: true,
          dragReleaseOnBounds: true,
          maxScale: 3,
          minScale: 1,
          initScale: 1,
          zoomRatio: 1
        }}
        isDebug={true}
      >
        {children}
      </MapWrapper>
    </>
  );
}
```

### 1. 基本のセットアップ

```tsx

const MapController = () => {
  const { zoomIn, zoomOut, focusTo } = useMap();

  return (
    <div>
      <button onClick={zoomIn}>ズームイン</button>
      <button onClick={zoomOut}>ズームアウト</button>
      <button onClick={() => focusTo({ x: 0.3, y: -0.2 })}>中心に移動</button>
    </div>
  );
};
```

---
### 2. SVG要素のスタイル操作

```tsx
<SvgElements selector='[data-type="station"]' style={{ fill: 'blue' }} />
```

---

### 3. 四角形エリアの監視

```tsx
const { useInQuadrilateralObserver } = useMap();

useInQuadrilateralObserver(
  [
    { x: -0.3, y: 0.2 },
    { x: 0.3, y: 0.2 },
    { x: 0.3, y: -0.3 },
    { x: -0.3, y: -0.3 },
  ],
  {
    onEnter: () => console.log('エリア内に入りました'),
    onExit: () => console.log('エリアから出ました'),
    onChange: (inside) => console.log(inside ? '中にいる' : '外にいる'),
  }
);
```

---

## 🧠 型情報

### `Point`

```ts
type Point = { x: number; y: number };
```

## 🧰 補足

- `createNormalizer` により、SVGの正規化座標（-1〜1）とピクセル座標の変換が自動化されています。
- マップ本体の状態は React Context、デモの区間表示は React の state で管理します。

---

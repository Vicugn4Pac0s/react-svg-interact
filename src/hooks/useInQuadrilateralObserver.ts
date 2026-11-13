import type { Point } from '../types';
import { useEffect, useRef } from 'react';
import { useMapState } from './useMapState';

type ObserverOptions = {
  onEnter?: () => void;
  onExit?: () => void;
  onChange?: (isInside: boolean) => void; // 常に呼ばれるコールバック
};

/**
 * 指定された四角形の領域に、現在の座標（point）が含まれているかを監視し、
 * 状態変化に応じてコールバックを実行するカスタムフック。
 *
 * - MapProvider で管理されている `center` 座標を監視対象とし、
 * - 四角形領域内外への出入りに応じて `onEnter` / `onExit` を発火、
 * - 毎回の判定結果は `onChange` 経由で通知される。
 *
 * @param rectPoints - 判定対象となる凸四辺形の4点（順序は任意だが、閉じた四角形になること）
 * @param options - 各種コールバック関数
 *   - `onEnter` 中に入ったときに1回だけ発火
 *   - `onExit` 外に出たときに1回だけ発火
 *   - `onChange` 毎回の判定結果（true/false）を受け取る
 *
 * @example
 * useInQuadrilateralObserver(
 *   [
 *     { x: -0.35, y: 0.5 },
 *     { x: 0.25, y: 0.5 },
 *     { x: 0.25, y: 0.15 },
 *     { x: -0.35, y: 0.15 }
 *   ],
 *   {
 *     onEnter: () => console.log('エリアに入りました'),
 *     onExit: () => console.log('エリアから出ました'),
 *     onChange: (isInside) => console.log(isInside ? '中' : '外')
 *   }
 * );
 */
export const useInQuadrilateralObserver = (
  rectPoints: [Point, Point, Point, Point],
  options: ObserverOptions
) => {
  const { center: point } = useMapState();
  const wasInsideRef = useRef<boolean | null>(null);

  useEffect(() => {
    const cross = (p1: Point, p2: Point, p: Point) =>
      (p2.x - p1.x) * (p.y - p1.y) - (p2.y - p1.y) * (p.x - p1.x);

    const signs = rectPoints.map((p, i) => {
      const next = rectPoints[(i + 1) % 4];
      return cross(p, next, point);
    });

    const isInside = signs.every((s) => s >= 0) || signs.every((s) => s <= 0);

    options.onChange?.(isInside);

    if (wasInsideRef.current === null) {
      wasInsideRef.current = isInside;
      return;
    }

    if (!wasInsideRef.current && isInside) {
      options.onEnter?.();
    }

    if (wasInsideRef.current && !isInside) {
      options.onExit?.();
    }

    wasInsideRef.current = isInside;
  }, [point, rectPoints, options]);
};

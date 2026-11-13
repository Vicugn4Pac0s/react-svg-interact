import type Zoomist from "zoomist";
import type { Point } from "../types";

export type Normalizer = {
  /**
   * ズーム・パンされたピクセル位置から -1 ~ 1 の正規化座標に変換
   * @param x 画面上のX座標（translateX）
   * @param y 画面上のY座標（translateY）
   * @returns 正規化された座標 { x, y }
   */
  toNormalized: (x: number, y: number) => Point;

  /**
   * 正規化された -1 ~ 1 の座標からピクセル座標に変換
   * @param nx 正規化されたX座標
   * @param ny 正規化されたY座標
   * @returns ピクセル単位の座標 { x, y }
   */
  toPixel: (nx: number, ny: number) => Point;
};

/**
 * `Zoomist` インスタンスの transform 情報と element サイズをもとに、
 * ピクセル <-> 正規化座標（-1 ~ 1）間の変換器を生成する。
 *
 * @param zoomist 初期化済みの Zoomist インスタンス
 * @returns 正規化変換関数を提供する Normalizer オブジェクト（要素未設定なら null）
 */
export const createNormalizer = (zoomist: Zoomist): Normalizer | null => {
  if (!zoomist?.element) return null;

  const rect = zoomist.element.getBoundingClientRect();
  const scale = zoomist.transform.scale;
  const halfWidth = rect.width / 2;
  const halfHeight = rect.height / 2;

  return {
    toNormalized: (x, y) => {
      const normX = -1 * mapRange(x / scale, -halfWidth, halfWidth, -1, 1);
      const normY = mapRange(y / scale, -halfHeight, halfHeight, -1, 1);
      const roundedNormX = roundTo(normX, 3);
      const roundedNormY = roundTo(normY, 3);
      return { x: roundedNormX, y: roundedNormY };
    },
    toPixel: (nx, ny) => {
      const px = -1 * mapRange(nx, -1, 1, -halfWidth, halfWidth) * scale;
      const py = mapRange(ny, -1, 1, -halfHeight, halfHeight) * scale;
      return { x: px, y: py };
    },
  };
};

/**
 * ある数値を、指定された入力範囲（inMin〜inMax）から
 * 出力範囲（outMin〜outMax）へと線形変換（マッピング）する。
 *
 * 例えば、`value = 5` を `0〜10` の範囲から `0〜100` にマップすると `50` を返す。
 *
 * @param value - マッピング対象の数値
 * @param inMin - 入力値の最小値（元のスケールの下限）
 * @param inMax - 入力値の最大値（元のスケールの上限）
 * @param outMin - 出力値の最小値（変換後スケールの下限）
 * @param outMax - 出力値の最大値（変換後スケールの上限）
 * @returns 指定された出力範囲に対応する変換後の数値
 *
 * @example
 * mapRange(5, 0, 10, 0, 100); // => 50
 * mapRange(0.5, 0, 1, 10, 20); // => 15
 * mapRange(3, 0, 5, -1, 1); // => 0.2
 */
export const mapRange = (value: number, inMin: number, inMax: number, outMin: number, outMax: number): number => {
  if (inMax === inMin) return outMin;
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

/**
 * 指定した小数桁数に丸める関数（四捨五入）
 * 例: roundTo(0.123456, 3) → 0.123
 *
 * @param n - 丸め対象の数値
 * @param digits - 小数点以下の桁数（デフォルト: 3）
 * @returns 指定桁数に丸めた数値
 */
export const roundTo = (n: number, digits: number = 3): number => {
  const factor = Math.pow(10, digits);
  return Math.round(n * factor) / factor;
};

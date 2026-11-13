import { useSvgStyle, type SvgStyle } from '../hooks/useSvgStyle';
import { useSvgEvents, type SvgEventHandlers } from '../hooks/useSvgEvents';

export type SvgElementProps = {
  selector: string;
  style?: SvgStyle;
} & SvgEventHandlers;

/** セレクターに一致する最初の SVG 要素のスタイルとイベントを制御する。 */
export function SvgElement({ selector, style, ...events }: SvgElementProps) {
  useSvgStyle(selector, style, false);
  useSvgEvents(selector, events, false);
  return null;
}

import { useSvgStyle, type SvgStyle } from '../hooks/useSvgStyle';
import { useSvgEvents, type SvgEventHandlers } from '../hooks/useSvgEvents';

export type SvgElementsProps = {
  selector: string;
  style?: SvgStyle;
} & SvgEventHandlers;

/** セレクターに一致するすべての SVG 要素のスタイルとイベントを制御する。 */
export function SvgElements({ selector, style, ...events }: SvgElementsProps) {
  useSvgStyle(selector, style, true);
  useSvgEvents(selector, events, true);
  return null;
}

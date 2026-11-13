import { useEffect, type CSSProperties } from 'react';
import { useMapInstance } from '../context/MapContext';

export type SvgStyle = CSSProperties | ((element: SVGElement, index: number) => CSSProperties);

// React の style と同様、これらの数値には px を付けない。
const unitlessProperties = new Set([
  'animationIterationCount', 'aspectRatio', 'borderImageOutset', 'borderImageSlice',
  'borderImageWidth', 'boxFlex', 'boxFlexGroup', 'boxOrdinalGroup', 'columnCount',
  'columns', 'fillOpacity', 'flex', 'flexGrow', 'flexNegative', 'flexOrder',
  'flexPositive', 'flexShrink', 'floodOpacity', 'fontWeight', 'gridArea',
  'gridColumn', 'gridColumnEnd', 'gridColumnSpan', 'gridColumnStart', 'gridRow',
  'gridRowEnd', 'gridRowSpan', 'gridRowStart', 'lineClamp', 'lineHeight',
  'opacity', 'order', 'orphans', 'scale', 'shapeImageThreshold', 'stopOpacity',
  'strokeDasharray', 'strokeDashoffset', 'strokeMiterlimit', 'strokeOpacity',
  'strokeWidth', 'tabSize', 'widows', 'zIndex', 'zoom',
]);

function toCssProperty(property: string) {
  if (property.startsWith('--')) return property;
  return property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`).replace(/^ms-/, '-ms-');
}

function toCssValue(property: string, value: string | number) {
  const unprefixed = property.replace(/^(Webkit|Moz|ms|O)([A-Z])/, (_, _prefix, letter: string) => letter.toLowerCase());
  if (typeof value !== 'number' || value === 0 || property.startsWith('--') || unitlessProperties.has(unprefixed)) {
    return String(value);
  }
  return `${value}px`;
}

/** インスタンスの準備完了後にスタイルを適用し、変更・終了時に元の宣言へ戻す。 */
export function useSvgStyle(selector: string, style: SvgStyle | undefined, multiple: boolean) {
  const { zoomist } = useMapInstance();

  useEffect(() => {
    if (!zoomist?.mounted || !style) return;
    const matches = Array.from(zoomist.image.querySelectorAll(selector))
      .filter((element): element is SVGElement => element instanceof SVGElement);
    const elements = multiple ? matches : matches.slice(0, 1);
    const restore: (() => void)[] = [];

    elements.forEach((element, index) => {
      const resolvedStyle = typeof style === 'function' ? style(element, index) : style;
      const hadStyle = element.hasAttribute('style');
      const original: { property: string; value: string; priority: string }[] = [];

      Object.entries(resolvedStyle).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        const property = toCssProperty(key);
        original.push({
          property,
          value: element.style.getPropertyValue(property),
          priority: element.style.getPropertyPriority(property),
        });
        element.style.setProperty(property, toCssValue(key, value));
      });

      restore.push(() => {
        original.forEach(({ property, value, priority }) => {
          if (value) element.style.setProperty(property, value, priority);
          else element.style.removeProperty(property);
        });
        if (!hadStyle && element.style.length === 0) element.removeAttribute('style');
      });
    });

    return () => { restore.forEach((reset) => reset()); };
  }, [zoomist, selector, style, multiple]);
}

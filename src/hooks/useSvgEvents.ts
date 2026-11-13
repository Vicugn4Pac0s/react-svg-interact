import { useEffect } from 'react';
import { useMapInstance } from '../context/MapContext';

const eventNames = {
  onClick: 'click',
  onDoubleClick: 'dblclick',
  onContextMenu: 'contextmenu',
  onPointerEnter: 'pointerenter',
  onPointerLeave: 'pointerleave',
  onPointerOver: 'pointerover',
  onPointerOut: 'pointerout',
  onPointerDown: 'pointerdown',
  onPointerMove: 'pointermove',
  onPointerUp: 'pointerup',
  onPointerCancel: 'pointercancel',
  onGotPointerCapture: 'gotpointercapture',
  onLostPointerCapture: 'lostpointercapture',
  onMouseEnter: 'mouseenter',
  onMouseLeave: 'mouseleave',
  onMouseOver: 'mouseover',
  onMouseOut: 'mouseout',
  onMouseDown: 'mousedown',
  onMouseMove: 'mousemove',
  onMouseUp: 'mouseup',
  onTouchStart: 'touchstart',
  onTouchMove: 'touchmove',
  onTouchEnd: 'touchend',
  onTouchCancel: 'touchcancel',
  onKeyDown: 'keydown',
  onKeyUp: 'keyup',
  onFocus: 'focus',
  onBlur: 'blur',
  onWheel: 'wheel',
} as const satisfies Record<string, keyof SVGElementEventMap>;

/** ハンドラー実行中の currentTarget は、セレクターに一致した SVG 要素。 */
export type SvgEvent<E extends Event = Event> = E & { readonly currentTarget: SVGElement };

export type SvgEventHandlers = {
  [K in keyof typeof eventNames]?: (event: SvgEvent<SVGElementEventMap[typeof eventNames[K]]>) => void;
};

/** DOM のネイティブイベントを登録し、ハンドラー更新・対象変更・終了時に解除する。 */
export function useSvgEvents(selector: string, handlers: SvgEventHandlers, multiple: boolean) {
  const { zoomist } = useMapInstance();

  useEffect(() => {
    if (!zoomist?.mounted) return;
    const matches = Array.from(zoomist.image.querySelectorAll(selector))
      .filter((element): element is SVGElement => element instanceof SVGElement);
    const elements = multiple ? matches : matches.slice(0, 1);
    const dispose: (() => void)[] = [];

    (Object.keys(eventNames) as (keyof typeof eventNames)[]).forEach((prop) => {
      const handler = handlers[prop];
      if (!handler) return;
      const eventName = eventNames[prop];
      // prop とイベント型の対応は SvgEventHandlers で保証する。
      const listener: EventListener = (event) => {
        (handler as (event: SvgEvent) => void)(event as SvgEvent);
      };
      elements.forEach((element) => {
        element.addEventListener(eventName, listener, { passive: false });
        dispose.push(() => element.removeEventListener(eventName, listener));
      });
    });

    return () => { dispose.forEach((remove) => remove()); };
  }, [zoomist, selector, handlers, multiple]);
}

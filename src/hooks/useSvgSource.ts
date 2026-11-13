import { useEffect, useRef, useState } from 'react';

/** URL の変更・終了時に取得を中止し、古いレスポンスによる上書きを防ぐ。 */
export function useSvgSource(
  src: string | undefined,
  svgHtml: string | null | undefined,
  onLoadError?: (error: Error) => void,
) {
  const [loaded, setLoaded] = useState<{ src: string; html: string } | null>(null);
  const errorHandler = useRef(onLoadError);

  useEffect(() => {
    errorHandler.current = onLoadError;
  }, [onLoadError]);

  useEffect(() => {
    setLoaded(null);
    if (src === undefined) return;
    const url = src;
    const controller = new AbortController();

    async function loadSvg() {
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Failed to load SVG: ${response.status} ${response.statusText} (${url})`);
        }
        const html = await response.text();
        if (controller.signal.aborted) return;
        setLoaded({ src: url, html });
      } catch (cause) {
        if (controller.signal.aborted) return;
        const error = cause instanceof Error ? cause : new Error(String(cause));
        if (errorHandler.current) errorHandler.current(error);
        else console.error(error);
      }
    }

    void loadSvg();
    return () => controller.abort();
  }, [src]);

  return src === undefined ? svgHtml ?? null : loaded?.src === src ? loaded.html : null;
}

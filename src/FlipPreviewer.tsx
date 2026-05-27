import {
  useRef,
  useState,
  useCallback,
  useEffect,
  useImperativeHandle,
  type CSSProperties,
  type Ref,
} from "react";

export interface FlipPreviewerImage {
  /** Image source URL */
  src: string;
  /** Alt text for the image */
  alt?: string;
  /** Optional link URL — clicking the image navigates here */
  href?: string;
  /** Link title attribute */
  title?: string;
  /** Link target attribute (e.g., "_blank") */
  target?: string;
  /** Link rel attribute (e.g., "noopener noreferrer") */
  rel?: string;
}

export interface FlipPreviewerRef {
  /** Start the hover animation (only applies in "hover" mode) */
  start: () => void;
  /** Pause the animation and reset to the first frame (only applies in "hover" mode) */
  pause: () => void;
}

export interface FlipPreviewerProps {
  /**
   * How images cycle:
   * - `"position"` — image changes based on horizontal mouse/touch position (default)
   * - `"hover"` — images auto-cycle on a timer when hovered
   */
  mode?: "position" | "hover";
  /** Array of images to flip through */
  images: FlipPreviewerImage[];
  /** Width of the component (CSS value). Omit to fill parent at 100%. */
  width?: number | string;
  /** Height of the component (CSS value). Omit to fill parent at 100%. */
  height?: number | string;
  /**
   * How images fit within the container:
   * - `"cover"` — image covers the entire container, may crop (default)
   * - `"contain"` — image fits entirely within the container, may letterbox
   */
  fit?: "cover" | "contain";
  /** Delay in ms between frame transitions — only used in "hover" mode. Omit for max speed (requestAnimationFrame). */
  delay?: number;
  /** Start animating automatically without hover — only used in "hover" mode (default: false) */
  autoPlay?: boolean;
  /** Show a progress bar while images preload — only used in "hover" mode (default: true) */
  showProgress?: boolean;
  /** Show a horizontal resize cursor when in "position" mode (default: true) */
  showCursor?: boolean;
  /** Show debug overlay with mouse coordinates and position info — only used in "position" mode */
  debug?: boolean;
  /** Additional CSS class name(s) for the container */
  className?: string;
  /** Additional inline styles for the container */
  style?: CSSProperties;
  /** Callback fired when the active image index changes */
  onIndexChange?: (index: number) => void;
  /** Callback fired when all images have finished preloading — only used in "hover" mode */
  onImagesLoaded?: () => void;
  /** Imperative handle ref for start/pause control in "hover" mode */
  ref?: Ref<FlipPreviewerRef>;
}

export function FlipPreviewer({
  mode = "position",
  images,
  width,
  height,
  fit = "cover",
  delay,
  autoPlay = false,
  showProgress = true,
  showCursor = true,
  debug = false,
  className,
  style,
  onIndexChange,
  onImagesLoaded,
  ref,
}: FlipPreviewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | number | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [debugInfo, setDebugInfo] = useState("");
  const [loadedCount, setLoadedCount] = useState(0);
  const [allLoaded, setAllLoaded] = useState(false);

  const activeIndexRef = useRef(0);
  const isPlayingRef = useRef(false);

  // ── Preload images (hover mode) ──────────────────────────────
  useEffect(() => {
    if (mode !== "hover" || images.length === 0) {
      setAllLoaded(true);
      return;
    }

    let loaded = 0;
    setLoadedCount(0);
    setAllLoaded(false);

    const total = images.length;
    images.forEach(({ src }) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        loaded++;
        setLoadedCount(loaded);
        if (loaded >= total) {
          setAllLoaded(true);
          onImagesLoaded?.();
        }
      };
      img.src = src;
    });
  }, [mode, images, onImagesLoaded]);

  // ── Hover mode: animation ────────────────────────────────────
  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      if (delay != null) {
        clearTimeout(timerRef.current as ReturnType<typeof setTimeout>);
      } else {
        cancelAnimationFrame(timerRef.current as number);
      }
      timerRef.current = null;
    }
  }, [delay]);

  const advanceFrame = useCallback(() => {
    if (!isPlayingRef.current) return;
    if (images.length <= 1) return;

    const next =
      activeIndexRef.current + 1 >= images.length
        ? 0
        : activeIndexRef.current + 1;

    activeIndexRef.current = next;
    setActiveIndex(next);
    onIndexChange?.(next);

    if (delay != null) {
      timerRef.current = setTimeout(advanceFrame, delay);
    } else {
      timerRef.current = requestAnimationFrame(advanceFrame);
    }
  }, [images.length, delay, onIndexChange]);

  const startAnimation = useCallback(() => {
    if (!allLoaded || images.length <= 1) return;
    isPlayingRef.current = true;
    clearTimer();
    if (delay != null) {
      timerRef.current = setTimeout(advanceFrame, delay);
    } else {
      timerRef.current = requestAnimationFrame(advanceFrame);
    }
  }, [allLoaded, images.length, delay, advanceFrame, clearTimer]);

  const stopAnimation = useCallback(() => {
    isPlayingRef.current = false;
    clearTimer();
    activeIndexRef.current = 0;
    setActiveIndex(0);
    onIndexChange?.(0);
  }, [clearTimer, onIndexChange]);

  // Auto-play on mount if enabled (hover mode)
  useEffect(() => {
    if (mode === "hover" && autoPlay && allLoaded) {
      startAnimation();
    }
    return () => clearTimer();
  }, [mode, autoPlay, allLoaded, startAnimation, clearTimer]);

  // Expose start/pause via ref (hover mode)
  useImperativeHandle(
    ref,
    () => ({
      start: startAnimation,
      pause: stopAnimation,
    }),
    [startAnimation, stopAnimation]
  );

  const handleMouseEnter = useCallback(() => {
    if (mode === "hover" && !autoPlay) {
      startAnimation();
    }
  }, [mode, autoPlay, startAnimation]);

  const handleMouseLeave = useCallback(() => {
    if (mode === "hover" && !autoPlay) {
      stopAnimation();
    }
  }, [mode, autoPlay, stopAnimation]);

  // ── Position mode: mouse-position-based ──────────────────────
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (mode !== "position") return;

      const container = containerRef.current;
      if (!container || images.length === 0) return;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      let pos = Math.floor((x / rect.width) * images.length);
      pos = Math.max(0, Math.min(pos, images.length - 1));

      if (pos !== activeIndexRef.current) {
        activeIndexRef.current = pos;
        setActiveIndex(pos);
        onIndexChange?.(pos);
      }

      if (debug) {
        const y = e.clientY - rect.top;
        setDebugInfo(
          `x:${Math.round(x)}, y:${Math.round(y)}, img:${pos + 1}/${images.length}, w:${Math.round(rect.width)}, h:${Math.round(rect.height)}`
        );
      }
    },
    [mode, images.length, debug, onIndexChange]
  );

  // Reset index if images change
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional trigger when images change
  useEffect(() => {
    setActiveIndex(0);
    activeIndexRef.current = 0;
  }, [images]);

  // ── Render ───────────────────────────────────────────────────
  if (images.length === 0) return null;

  const activeImage = images[activeIndex];
  const hasLink = !!activeImage.href;

  const containerStyle: CSSProperties = {
    position: "relative",
    width: width ?? "100%",
    height: height ?? "100%",
    overflow: "hidden",
    cursor: hasLink ? "pointer" : mode === "position" && showCursor ? "ew-resize" : "default",
    ...style,
  };

  const imgElement = (
    <img
      src={activeImage.src}
      alt={activeImage.alt ?? ""}
      className="cj-flip-previewer__img"
      style={{ objectFit: fit }}
      draggable={false}
    />
  );

  const content = hasLink ? (
    <a
      href={activeImage.href}
      title={activeImage.title}
      target={activeImage.target}
      rel={activeImage.rel}
      className="cj-flip-previewer__link"
    >
      {imgElement}
    </a>
  ) : (
    imgElement
  );

  const progressPct =
    images.length > 0 ? (loadedCount / images.length) * 100 : 0;

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: container tracks pointer position for image flipping
    <div
      ref={containerRef}
      className={`cj-flip-previewer${className ? ` ${className}` : ""}`}
      style={containerStyle}
      onPointerMove={handlePointerMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {content}

      {mode === "hover" && showProgress && !allLoaded && (
        <div className="cj-flip-previewer__progress">
          <div
            className="cj-flip-previewer__progress-bar"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      )}

      {mode === "position" && debug && (
        <div className="cj-flip-previewer__debug">{debugInfo}</div>
      )}
    </div>
  );
}

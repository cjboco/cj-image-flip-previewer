import {
  useRef,
  useState,
  useCallback,
  useEffect,
  useImperativeHandle,
  type CSSProperties,
  type Ref,
} from "react";

export interface VideoPreviewerRef {
  /** Start the frame animation */
  start: () => void;
  /** Pause the animation and reset to the first frame */
  pause: () => void;
}

export interface VideoPreviewerProps {
  /** Array of image URLs to cycle through as frames */
  images: string[];
  /** The initial/default image displayed before hover. If omitted, uses the first item in `images`. */
  poster?: string;
  /** Delay in milliseconds between frame transitions (default: 450) */
  delay?: number;
  /** Start animating automatically without requiring hover (default: false) */
  autoPlay?: boolean;
  /** Show a progress bar while images are preloading (default: true) */
  showProgress?: boolean;
  /** Optional link URL — clicking the previewer navigates here */
  href?: string;
  /** Link target attribute (e.g., "_blank") */
  target?: string;
  /** Link rel attribute (e.g., "noopener noreferrer") */
  rel?: string;
  /** Width of the component (CSS value) */
  width: number | string;
  /** Height of the component (CSS value) */
  height: number | string;
  /** Additional CSS class name(s) for the container */
  className?: string;
  /** Additional inline styles for the container */
  style?: CSSProperties;
  /** Callback fired when the active frame index changes */
  onFrameChange?: (index: number) => void;
  /** Callback fired when all images have finished preloading */
  onImagesLoaded?: () => void;
  /** Imperative handle ref for start/pause control */
  ref?: Ref<VideoPreviewerRef>;
}

export function VideoPreviewer({
  images,
  poster,
  delay = 450,
  autoPlay = false,
  showProgress = true,
  href,
  target,
  rel,
  width,
  height,
  className,
  style,
  onFrameChange,
  onImagesLoaded,
  ref,
}: VideoPreviewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // All frames: poster (or first image) + the rest
  const allFrames = useRef<string[]>([]);
  const [frameIndex, setFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [allLoaded, setAllLoaded] = useState(false);

  const frameIndexRef = useRef(0);
  const isPlayingRef = useRef(false);

  // Build the full frame list when images/poster change
  useEffect(() => {
    const first = poster ?? images[0];
    if (!first) {
      allFrames.current = [];
      return;
    }
    // Deduplicate: if poster is the same as images[0], don't repeat it
    const rest =
      first === images[0] ? images.slice(1) : images;
    allFrames.current = [first, ...rest];
  }, [images, poster]);

  // Preload images
  useEffect(() => {
    if (allFrames.current.length === 0) return;

    let loaded = 0;
    setLoadedCount(0);
    setAllLoaded(false);

    const total = allFrames.current.length;

    allFrames.current.forEach((src) => {
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
  }, [images, poster, onImagesLoaded]);

  // Auto-play on mount if enabled
  useEffect(() => {
    if (autoPlay && allLoaded) {
      startAnimation();
    }
    return () => clearTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, allLoaded]);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const advanceFrame = useCallback(() => {
    if (!isPlayingRef.current) return;

    const frames = allFrames.current;
    if (frames.length <= 1) return;

    const next =
      frameIndexRef.current + 1 >= frames.length
        ? 1
        : frameIndexRef.current + 1;

    frameIndexRef.current = next;
    setFrameIndex(next);
    onFrameChange?.(next);

    timerRef.current = setTimeout(advanceFrame, delay);
  }, [delay, onFrameChange]);

  const startAnimation = useCallback(() => {
    if (!allLoaded || allFrames.current.length <= 1) return;
    isPlayingRef.current = true;
    setIsPlaying(true);
    clearTimer();
    timerRef.current = setTimeout(advanceFrame, delay);
  }, [allLoaded, delay, advanceFrame, clearTimer]);

  const stopAnimation = useCallback(() => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    clearTimer();
    frameIndexRef.current = 0;
    setFrameIndex(0);
    onFrameChange?.(0);
  }, [clearTimer, onFrameChange]);

  // Expose start/pause via ref
  useImperativeHandle(
    ref,
    () => ({
      start: startAnimation,
      pause: stopAnimation,
    }),
    [startAnimation, stopAnimation]
  );

  const handleMouseEnter = useCallback(() => {
    if (!autoPlay) {
      startAnimation();
    }
  }, [autoPlay, startAnimation]);

  const handleMouseLeave = useCallback(() => {
    if (!autoPlay) {
      stopAnimation();
    }
  }, [autoPlay, stopAnimation]);

  if (allFrames.current.length === 0) return null;

  const currentSrc = allFrames.current[frameIndex] ?? allFrames.current[0];
  const progressPct =
    allFrames.current.length > 0
      ? (loadedCount / allFrames.current.length) * 100
      : 0;

  const containerStyle: CSSProperties = {
    position: "relative",
    width,
    height,
    overflow: "hidden",
    cursor: href ? "pointer" : "default",
    ...style,
  };

  const imgElement = (
    <img
      src={currentSrc}
      alt=""
      className="cj-video-previewer__img"
      draggable={false}
    />
  );

  const content = href ? (
    <a
      href={href}
      target={target}
      rel={rel}
      className="cj-video-previewer__link"
    >
      {imgElement}
    </a>
  ) : (
    imgElement
  );

  return (
    <div
      ref={containerRef}
      className={`cj-video-previewer${className ? ` ${className}` : ""}`}
      style={containerStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {content}

      {showProgress && !allLoaded && (
        <div className="cj-video-previewer__progress">
          <div
            className="cj-video-previewer__progress-bar"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      )}
    </div>
  );
}

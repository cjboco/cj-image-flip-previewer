import { useRef, useState, useCallback, useEffect, type CSSProperties } from "react";

export interface FlipBoxImage {
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

export interface ImageFlipBoxProps {
  /** Array of images to flip through based on mouse/touch position */
  images: FlipBoxImage[];
  /** Width of the component (CSS value) */
  width: number | string;
  /** Height of the component (CSS value) */
  height: number | string;
  /** Show debug overlay with mouse coordinates and position info */
  debug?: boolean;
  /** Additional CSS class name(s) for the container */
  className?: string;
  /** Additional inline styles for the container */
  style?: CSSProperties;
  /** Callback fired when the active image index changes */
  onIndexChange?: (index: number) => void;
}

export function ImageFlipBox({
  images,
  width,
  height,
  debug = false,
  className,
  style,
  onIndexChange,
}: ImageFlipBoxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [debugInfo, setDebugInfo] = useState("");

  const lastIndexRef = useRef(0);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const container = containerRef.current;
      if (!container || images.length === 0) return;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      let pos = Math.floor((x / rect.width) * images.length);
      pos = Math.max(0, Math.min(pos, images.length - 1));

      if (pos !== lastIndexRef.current) {
        lastIndexRef.current = pos;
        setActiveIndex(pos);
        onIndexChange?.(pos);
      }

      if (debug) {
        const y = e.clientY - rect.top;
        setDebugInfo(
          `x:${Math.round(x)}, y:${Math.round(y)}, idx:${pos}/${images.length}, w:${Math.round(rect.width)}, h:${Math.round(rect.height)}`
        );
      }
    },
    [images.length, debug, onIndexChange]
  );

  // Reset index if images change
  useEffect(() => {
    setActiveIndex(0);
    lastIndexRef.current = 0;
  }, [images]);

  if (images.length === 0) return null;

  const activeImage = images[activeIndex];

  const containerStyle: CSSProperties = {
    position: "relative",
    width,
    height,
    overflow: "hidden",
    cursor: "pointer",
    ...style,
  };

  const imgElement = (
    <img
      src={activeImage.src}
      alt={activeImage.alt ?? ""}
      className="cj-image-flipbox__img"
      draggable={false}
    />
  );

  return (
    <div
      ref={containerRef}
      className={`cj-image-flipbox${className ? ` ${className}` : ""}`}
      style={containerStyle}
      onPointerMove={handlePointerMove}
    >
      {activeImage.href ? (
        <a
          href={activeImage.href}
          title={activeImage.title}
          target={activeImage.target}
          rel={activeImage.rel}
          className="cj-image-flipbox__link"
        >
          {imgElement}
        </a>
      ) : (
        imgElement
      )}

      {debug && (
        <div className="cj-image-flipbox__debug">{debugInfo}</div>
      )}
    </div>
  );
}

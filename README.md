# cj-image-flipbox

React components for interactive image previews. Zero dependencies beyond React 19+.

- **`<ImageFlipBox>`** — Flip through images based on mouse/touch position. Ideal for 360-degree product views.
- **`<ImageVideoPreviewer>`** — Animate through image frames on hover, like a video thumbnail previewer.

## Install

```bash
npm install cj-image-flipbox
```

## Setup

Import the stylesheet once in your app (e.g., in your root layout or entry file):

```tsx
import "cj-image-flipbox/styles.css";
```

---

## ImageFlipBox

Displays a single image that changes based on the horizontal mouse/touch position within the container. Move left-to-right to cycle through all images.

### Basic Usage

```tsx
import { ImageFlipBox } from "cj-image-flipbox";

function ProductView() {
  return (
    <ImageFlipBox
      width={320}
      height={240}
      images={[
        { src: "/images/angle-1.jpg", alt: "Front" },
        { src: "/images/angle-2.jpg", alt: "Side" },
        { src: "/images/angle-3.jpg", alt: "Back" },
        { src: "/images/angle-4.jpg", alt: "Other side" },
      ]}
    />
  );
}
```

### With Links

Each image can have its own link:

```tsx
<ImageFlipBox
  width={320}
  height={240}
  images={[
    { src: "/img1.jpg", href: "/products/1", title: "View product" },
    { src: "/img2.jpg", href: "/products/2", target: "_blank", rel: "noopener noreferrer" },
  ]}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `FlipBoxImage[]` | *required* | Array of images to flip through |
| `width` | `number \| string` | *required* | Container width |
| `height` | `number \| string` | *required* | Container height |
| `debug` | `boolean` | `false` | Show debug overlay with coordinates and index |
| `className` | `string` | — | Additional CSS class(es) |
| `style` | `CSSProperties` | — | Additional inline styles |
| `onIndexChange` | `(index: number) => void` | — | Called when the active image changes |

### FlipBoxImage

| Property | Type | Description |
|----------|------|-------------|
| `src` | `string` | Image source URL (required) |
| `alt` | `string` | Alt text |
| `href` | `string` | Link URL |
| `title` | `string` | Link title |
| `target` | `string` | Link target (e.g., `"_blank"`) |
| `rel` | `string` | Link rel (e.g., `"noopener noreferrer"`) |

---

## ImageVideoPreviewer

Displays an image that animates through a sequence of frames on hover, like a video thumbnail preview (similar to Netflix/YouTube thumbnails).

### Basic Usage

```tsx
import { ImageVideoPreviewer } from "cj-image-flipbox";

function VideoThumbnail() {
  return (
    <ImageVideoPreviewer
      width={160}
      height={110}
      poster="/images/thumbnail.jpg"
      images={[
        "/images/frame-01.jpg",
        "/images/frame-02.jpg",
        "/images/frame-03.jpg",
        "/images/frame-04.jpg",
        "/images/frame-05.jpg",
      ]}
      delay={450}
    />
  );
}
```

### With Link and Auto-Play

```tsx
<ImageVideoPreviewer
  width={320}
  height={240}
  images={["/frame1.jpg", "/frame2.jpg", "/frame3.jpg"]}
  href="/watch/video-123"
  autoPlay
  delay={300}
  showProgress={false}
/>
```

### Imperative Control

Use a ref to programmatically start and pause the animation:

```tsx
import { useRef } from "react";
import { ImageVideoPreviewer, type ImageVideoPreviewerRef } from "cj-image-flipbox";

function ControlledPreviewer() {
  const previewerRef = useRef<ImageVideoPreviewerRef>(null);

  return (
    <>
      <ImageVideoPreviewer
        ref={previewerRef}
        width={320}
        height={240}
        images={["/frame1.jpg", "/frame2.jpg", "/frame3.jpg"]}
      />
      <button onClick={() => previewerRef.current?.start()}>Play</button>
      <button onClick={() => previewerRef.current?.pause()}>Pause</button>
    </>
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `string[]` | *required* | Array of image URLs to cycle through |
| `width` | `number \| string` | *required* | Container width |
| `height` | `number \| string` | *required* | Container height |
| `poster` | `string` | — | Initial image shown before animation. Defaults to `images[0]` |
| `delay` | `number` | `450` | Milliseconds between frame transitions |
| `autoPlay` | `boolean` | `false` | Start animating automatically (without hover) |
| `showProgress` | `boolean` | `true` | Show a progress bar while images preload |
| `href` | `string` | — | Link URL (clicking navigates here) |
| `target` | `string` | — | Link target |
| `rel` | `string` | — | Link rel |
| `className` | `string` | — | Additional CSS class(es) |
| `style` | `CSSProperties` | — | Additional inline styles |
| `onFrameChange` | `(index: number) => void` | — | Called when the displayed frame changes |
| `onImagesLoaded` | `() => void` | — | Called when all images finish preloading |
| `ref` | `Ref<ImageVideoPreviewerRef>` | — | Imperative handle for start/pause |

### ImageVideoPreviewerRef

| Method | Description |
|--------|-------------|
| `start()` | Start the frame animation |
| `pause()` | Pause and reset to the first frame |

---

## CSS Customization

The default styles use BEM-style class names that you can override:

```css
/* ImageFlipBox */
.cj-image-flipbox { }
.cj-image-flipbox__img { }
.cj-image-flipbox__link { }
.cj-image-flipbox__debug { }

/* ImageVideoPreviewer */
.cj-video-previewer { }
.cj-video-previewer__img { }
.cj-video-previewer__link { }
.cj-video-previewer__progress { }
.cj-video-previewer__progress-bar { }
```

---

## Requirements

- React 19+
- React DOM 19+

## License

BSD-3-Clause

## Author

Doug Jones — [Creative Juices, Bo. Co.](https://www.cjboco.com)

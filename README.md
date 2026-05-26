# cj-image-flip-previewer

A React component for interactive image previews. Zero dependencies beyond React 19+.

One component, two modes:
- **`mode="position"`** — Image changes based on horizontal mouse/touch position (360-degree product views)
- **`mode="hover"`** — Images auto-cycle on a timer when hovered (video thumbnail previews)

## Install

```bash
npm install cj-image-flip-previewer
```

## Setup

Import the stylesheet once in your app (e.g., in your root layout or entry file):

```tsx
import "cj-image-flip-previewer/styles.css";
```

---

## Position Mode (default)

Image changes based on where the mouse is horizontally within the container. Move left-to-right to cycle through all images.

```tsx
import { FlipPreviewer } from "cj-image-flip-previewer";

<FlipPreviewer
  width={320}
  height={240}
  images={[
    { src: "/images/angle-1.jpg", alt: "Front" },
    { src: "/images/angle-2.jpg", alt: "Side" },
    { src: "/images/angle-3.jpg", alt: "Back" },
    { src: "/images/angle-4.jpg", alt: "Other side" },
  ]}
/>
```

### With Links

Each image can have its own link:

```tsx
<FlipPreviewer
  width={320}
  height={240}
  images={[
    { src: "/img1.jpg", href: "/products/1", title: "View product" },
    { src: "/img2.jpg", href: "/products/2", target: "_blank", rel: "noopener noreferrer" },
  ]}
/>
```

---

## Hover Mode

Images auto-cycle on a timer when the mouse enters the container, like Netflix/YouTube thumbnail previews.

```tsx
<FlipPreviewer
  mode="hover"
  width={160}
  height={110}
  delay={450}
  images={[
    { src: "/images/frame-01.jpg" },
    { src: "/images/frame-02.jpg" },
    { src: "/images/frame-03.jpg" },
    { src: "/images/frame-04.jpg" },
  ]}
/>
```

### Auto-Play

Start cycling immediately without waiting for hover:

```tsx
<FlipPreviewer
  mode="hover"
  autoPlay
  delay={300}
  showProgress={false}
  width={320}
  height={240}
  images={[
    { src: "/frame1.jpg", href: "/watch/123" },
    { src: "/frame2.jpg", href: "/watch/123" },
    { src: "/frame3.jpg", href: "/watch/123" },
  ]}
/>
```

### Imperative Control

Use a ref to programmatically start and pause the animation:

```tsx
import { useRef } from "react";
import { FlipPreviewer, type FlipPreviewerRef } from "cj-image-flip-previewer";

function ControlledPreviewer() {
  const ref = useRef<FlipPreviewerRef>(null);

  return (
    <>
      <FlipPreviewer
        ref={ref}
        mode="hover"
        width={320}
        height={240}
        images={[
          { src: "/frame1.jpg" },
          { src: "/frame2.jpg" },
          { src: "/frame3.jpg" },
        ]}
      />
      <button onClick={() => ref.current?.start()}>Play</button>
      <button onClick={() => ref.current?.pause()}>Pause</button>
    </>
  );
}
```

---

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `"position" \| "hover"` | `"position"` | How images cycle |
| `images` | `FlipPreviewerImage[]` | *required* | Array of images |
| `width` | `number \| string` | *required* | Container width |
| `height` | `number \| string` | *required* | Container height |
| `delay` | `number` | `450` | Ms between frames (hover mode only) |
| `autoPlay` | `boolean` | `false` | Auto-start animation (hover mode only) |
| `showProgress` | `boolean` | `true` | Show preload progress bar (hover mode only) |
| `debug` | `boolean` | `false` | Show debug overlay (position mode only) |
| `className` | `string` | — | Additional CSS class(es) |
| `style` | `CSSProperties` | — | Additional inline styles |
| `onIndexChange` | `(index: number) => void` | — | Called when the active image changes |
| `onImagesLoaded` | `() => void` | — | Called when all images finish preloading (hover mode only) |
| `ref` | `Ref<FlipPreviewerRef>` | — | Imperative handle for start/pause (hover mode only) |

### FlipPreviewerImage

| Property | Type | Description |
|----------|------|-------------|
| `src` | `string` | Image source URL (required) |
| `alt` | `string` | Alt text |
| `href` | `string` | Link URL |
| `title` | `string` | Link title |
| `target` | `string` | Link target (e.g., `"_blank"`) |
| `rel` | `string` | Link rel (e.g., `"noopener noreferrer"`) |

### FlipPreviewerRef

| Method | Description |
|--------|-------------|
| `start()` | Start the frame animation |
| `pause()` | Pause and reset to the first frame |

---

## CSS Customization

The default styles use BEM-style class names that you can override:

```css
.cj-flip-previewer { }
.cj-flip-previewer__img { }
.cj-flip-previewer__link { }
.cj-flip-previewer__debug { }
.cj-flip-previewer__progress { }
.cj-flip-previewer__progress-bar { }
```

---

## Requirements

- React 19+
- React DOM 19+

## License

BSD-3-Clause

## Author

Doug Jones — [Creative Juices, Bo. Co.](https://www.cjboco.com)

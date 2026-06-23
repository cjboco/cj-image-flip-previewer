# cj-image-flip-previewer

[![npm version](https://img.shields.io/npm/v/%40cjboco%2Fcj-image-flip-previewer)](https://www.npmjs.com/package/@cjboco/cj-image-flip-previewer)
[![license](https://img.shields.io/npm/l/%40cjboco%2Fcj-image-flip-previewer)](https://github.com/cjboco/cj-image-flip-previewer/blob/master/LICENSE)
[![deploy](https://img.shields.io/github/actions/workflow/status/cjboco/cj-image-flip-previewer/deploy-demo.yml?label=demo)](https://cjboco.github.io/cj-image-flip-previewer/)

A React component for interactive image previews. Zero dependencies beyond React 19+.

**[Live Demo](https://cjboco.github.io/cj-image-flip-previewer/)**

One component, two modes:
- **`mode="position"`** - Image changes based on horizontal mouse/touch position (360-degree product views)
- **`mode="hover"`** - Images auto-cycle on a timer when hovered (video thumbnail previews)

## Install

```bash
npm install @cjboco/cj-image-flip-previewer
```

## Setup

Import the stylesheet once in your app (e.g., in your root layout or entry file):

```tsx
import "@cjboco/cj-image-flip-previewer/styles.css";
```

---

## Position Mode (default)

Image changes based on where the mouse is horizontally within the container. Move left-to-right to cycle through all images.

```tsx
import { FlipPreviewer } from "@cjboco/cj-image-flip-previewer";

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
import { FlipPreviewer, type FlipPreviewerRef } from "@cjboco/cj-image-flip-previewer";

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
| `width` | `number \| string` | `"100%"` | Container width |
| `height` | `number \| string` | `"100%"` | Container height |
| `delay` | `number` | - | Ms between frames (hover mode only). Omit for max speed (requestAnimationFrame). |
| `autoPlay` | `boolean` | `false` | Auto-start animation (hover mode only) |
| `showProgress` | `boolean` | `true` | Show preload progress bar (hover mode only) |
| `showCursor` | `boolean` | `true` | Show horizontal resize cursor (position mode only) |
| `debug` | `boolean` | `false` | Show debug overlay (position mode only) |
| `className` | `string` | - | Additional CSS class(es) |
| `style` | `CSSProperties` | - | Additional inline styles |
| `onIndexChange` | `(index: number) => void` | - | Called when the active image changes |
| `onImagesLoaded` | `() => void` | - | Called when all images finish preloading (hover mode only) |
| `ref` | `Ref<FlipPreviewerRef>` | - | Imperative handle for start/pause (hover mode only) |

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

## Styling

### Default CSS

The included stylesheet uses `@layer components`, which works both as standalone CSS and with Tailwind CSS v4+. Import it once in your app:

```tsx
import "@cjboco/cj-image-flip-previewer/styles.css";
```

### Using with Tailwind CSS

Since the component styles are in the `components` layer, Tailwind utility classes automatically take priority - no `!important` needed. Just add classes via the `className` prop:

```tsx
<FlipPreviewer
  className="rounded-lg shadow-md cursor-grab"
  width={320}
  height={240}
  images={images}
/>
```

If you prefer full Tailwind control and don't want the default stylesheet at all, simply skip the CSS import. The component applies its essential layout styles inline, so it will still function correctly. You can then style everything with utility classes.

### CSS Custom Properties

The stylesheet exposes CSS variables for common customizations. Override them in your own CSS or Tailwind's `globals.css`:

| Variable | Default | Description |
|----------|---------|-------------|
| `--cj-flip-progress-height` | `4px` | Height of the preload progress bar |
| `--cj-flip-progress-bg` | `rgba(0,0,0,0.3)` | Progress bar track background |
| `--cj-flip-progress-color` | `#6bc4f7` | Progress bar fill color |
| `--cj-flip-progress-speed` | `0.2s` | Progress bar transition speed |
| `--cj-flip-debug-font-size` | `11px` | Debug overlay font size |
| `--cj-flip-debug-bg` | `rgba(0,0,0,0.6)` | Debug overlay background |
| `--cj-flip-debug-color` | `#fff` | Debug overlay text color |

**Override globally:**

```css
:root {
  --cj-flip-progress-color: hotpink;
  --cj-flip-progress-height: 6px;
}
```

**Override per instance:**

```tsx
<FlipPreviewer
  style={{ '--cj-flip-progress-color': '#facc15' } as CSSProperties}
  images={images}
/>
```

### BEM Class Names

For more targeted CSS overrides, all elements use BEM-style class names:

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

Doug Jones - [Creative Juices, Bo. Co.](https://www.cjboco.com)

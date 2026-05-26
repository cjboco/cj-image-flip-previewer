import { useState } from "react";
import { FlipPreviewer } from "../../src";
import type { FlipPreviewerImage } from "../../src";

const BASE = import.meta.env.BASE_URL;

const bettyBoop: FlipPreviewerImage[] = [
  "000030", "000060", "000090", "000120", "000150", "000180", "000210",
  "000240", "000270", "000300", "000330", "000360", "000390", "000420", "000450",
].map((n) => ({
  src: `${BASE}images/bb_minnie_the_moocher_${n}.jpg`,
  alt: `Betty Boop frame ${n}`,
}));

const superman: FlipPreviewerImage[] = [
  "000030", "000120", "000150", "000210", "000240", "000270", "000300", "000330",
].map((n) => ({
  src: `${BASE}images/superman_the_mechanical_monsters_${n}.jpg`,
  alt: `Superman frame ${n}`,
}));

const bugsBunny: FlipPreviewerImage[] = [
  "00027", ...Array.from({ length: 23 }, (_, i) => String(188 + i).padStart(5, "0")),
].map((n) => ({
  src: `${BASE}images/bugs_bunny_${n}.jpg`,
  alt: `Bugs Bunny frame ${n}`,
}));

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="code-block">
      <code>{children.trim()}</code>
    </pre>
  );
}

export function App() {
  const [hoverIndex, setHoverIndex] = useState(0);

  return (
    <div className="app">
      <header className="header">
        <h1>CJ Image Flip Previewer</h1>
        <p className="subtitle">
          React components for interactive image previews — flip through images
          by mouse position or animate frames on hover like a video previewer.
        </p>
        <a
          href="https://github.com/cjboco/cj-image-flip-previewer"
          className="github-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on GitHub
        </a>
      </header>

      <main className="examples">
        {/* ── Example 1: Hover mode ─────────────────────── */}
        <section className="example">
          <h2>Hover Mode</h2>
          <p>
            Images auto-cycle on a timer when you hover over the container.
            Includes a progress bar while images preload.
          </p>

          <div className="preview-row">
            <div className="preview-box small">
              <FlipPreviewer
                mode="hover"
                images={bettyBoop}
                width={160}
                height={110}
                onIndexChange={setHoverIndex}
              />
            </div>
            <span className="frame-info">Frame: {hoverIndex + 1} / {bettyBoop.length}</span>
          </div>

          <CodeBlock>{`<FlipPreviewer
  mode="hover"
  images={bettyBoop}
  width={160}
  height={110}
/>`}</CodeBlock>
        </section>

        {/* ── Example 2: Hover mode (fast, no progress) ── */}
        <section className="example">
          <h2>Hover Mode — Fast, No Progress Bar</h2>
          <p>
            A faster delay with the progress indicator disabled.
          </p>

          <div className="preview-row">
            <div className="preview-box small">
              <FlipPreviewer
                mode="hover"
                images={superman}
                width={160}
                height={110}
                delay={100}
                showProgress={false}
              />
            </div>
          </div>

          <CodeBlock>{`<FlipPreviewer
  mode="hover"
  images={superman}
  width={160}
  height={110}
  delay={100}
  showProgress={false}
/>`}</CodeBlock>
        </section>

        {/* ── Example 3: Position mode ───────────────────── */}
        <section className="example">
          <h2>Position Mode</h2>
          <p>
            The active image changes based on your horizontal mouse position
            within the container. Move your mouse left-to-right across the image.
          </p>

          <div className="preview-row">
            <div className="preview-box large">
              <FlipPreviewer
                mode="position"
                images={bugsBunny}
                width={320}
                height={240}
                debug
              />
            </div>
          </div>

          <CodeBlock>{`<FlipPreviewer
  mode="position"
  images={bugsBunny}
  width={320}
  height={240}
  debug
/>`}</CodeBlock>
        </section>

        {/* ── Example 4: Hover mode with autoPlay ──────── */}
        <section className="example">
          <h2>Hover Mode — Auto Play</h2>
          <p>
            Starts animating automatically without requiring a hover.
          </p>

          <div className="preview-row">
            <div className="preview-box small">
              <FlipPreviewer
                mode="hover"
                images={bettyBoop}
                width={160}
                height={110}
                delay={300}
                autoPlay
              />
            </div>
          </div>

          <CodeBlock>{`<FlipPreviewer
  mode="hover"
  images={bettyBoop}
  width={160}
  height={110}
  delay={300}
  autoPlay
/>`}</CodeBlock>
        </section>
      </main>

      <footer className="footer">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <a href="https://github.com/cjboco" target="_blank" rel="noopener noreferrer">
            Creative Juices Bo. Co.
          </a>{" "}
          &mdash; BSD-3-Clause License
        </p>
      </footer>
    </div>
  );
}

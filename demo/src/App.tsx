import { useState } from "react";
import type { FlipPreviewerImage } from "../../src";
import { FlipPreviewer } from "../../src";

const BASE = import.meta.env.BASE_URL;

const popeye: FlipPreviewerImage[] = Array.from({ length: 120 }, (_, i) =>
	String(i + 1).padStart(4, "0"),
).map((n) => ({
	src: `${BASE}images/popeye_frames/popeye_the_sailor_meets_sinbad_the_sailor_1936_${n}.webp`,
	alt: `Popeye frame ${n}`,
}));

const trainRobbery: FlipPreviewerImage[] = Array.from({ length: 120 }, (_, i) =>
	String(i + 1).padStart(4, "0"),
).map((n) => ({
	src: `${BASE}images/train_frames/the_great_train_robbery_1903_${n}.webp`,
	alt: `Train Robbery frame ${n}`,
}));

const bugsBunny: FlipPreviewerImage[] = [
	"00027",
	...Array.from({ length: 23 }, (_, i) => String(188 + i).padStart(5, "0")),
].map((n) => ({
	src: `${BASE}images/bugs_frames/bugs_bunny_${n}.jpg`,
	alt: `Bugs Bunny frame ${n}`,
}));

interface ExpandableVar {
	name: string;
	code: string;
}

function CodeBlock({
	children,
	variables,
}: { children: string; variables?: ExpandableVar[] }) {
	const [expanded, setExpanded] = useState<Set<string>>(new Set());

	const code = children.trim();

	if (!variables || variables.length === 0) {
		return (
			<pre className="code-block">
				<code>{code}</code>
			</pre>
		);
	}

	const toggle = (name: string) => {
		setExpanded((prev) => {
			const next = new Set(prev);
			if (next.has(name)) next.delete(name);
			else next.add(name);
			return next;
		});
	};

	const pattern = new RegExp(
		`(\\{)(${variables.map((v) => v.name).join("|")})(\\})`,
		"g",
	);

	const parts: React.ReactNode[] = [];
	let lastIndex = 0;
	let match: RegExpExecArray | null;

	while ((match = pattern.exec(code)) !== null) {
		if (match.index > lastIndex) {
			parts.push(code.slice(lastIndex, match.index));
		}

		const varName = match[2];
		const varDef = variables.find((v) => v.name === varName);
		const isExpanded = expanded.has(varName);

		parts.push(
			<span key={match.index}>
				{"{"}
				<button
					type="button"
					className="code-var-toggle"
					onClick={() => toggle(varName)}
					aria-expanded={isExpanded}
					aria-label={`${isExpanded ? "Collapse" : "Expand"} ${varName} definition`}
					title={`Click to ${isExpanded ? "hide" : "show"} ${varName} data`}
				>
					{varName}
				</button>
				{"}"}
				{isExpanded && varDef && (
					<span className="code-var-expansion">
						{"\n"}
						{"  // ── {0} ─────────────────────────\n".replace(
							"{0}",
							varName,
						)}
						{varDef.code}
					</span>
				)}
			</span>,
		);

		lastIndex = match.index + match[0].length;
	}

	if (lastIndex < code.length) {
		parts.push(code.slice(lastIndex));
	}

	return (
		<pre className="code-block">
			<code>{parts}</code>
		</pre>
	);
}

export function App() {
	const [hoverIndex, setHoverIndex] = useState(0);
	const [delayIndex, setDelayIndex] = useState(0);
	const [posIndex, setPosIndex] = useState(0);
	const [noCursorIndex, setNoCursorIndex] = useState(0);
	const [autoPlayIndex, setAutoPlayIndex] = useState(0);

	const popeyeVar: ExpandableVar = {
		name: "popeye",
		code: `  const popeye: FlipPreviewerImage[] = Array.from(\n    { length: 120 },\n    (_, i) => String(i + 1).padStart(4, "0"),\n  ).map((n) => ({\n    src: \`/images/popeye_..._\${n}.webp\`,\n    alt: \`Popeye frame \${n}\`,\n  }));`,
	};

	const trainRobberyVar: ExpandableVar = {
		name: "trainRobbery",
		code: `  const trainRobbery: FlipPreviewerImage[] = Array.from(\n    { length: 120 },\n    (_, i) => String(i + 1).padStart(4, "0"),\n  ).map((n) => ({\n    src: \`/images/train_..._\${n}.webp\`,\n    alt: \`Train Robbery frame \${n}\`,\n  }));`,
	};

	const bugsBunnyVar: ExpandableVar = {
		name: "bugsBunny",
		code: `  const bugsBunny: FlipPreviewerImage[] = [\n    "00027",\n    ...Array.from({ length: 23 }, (_, i) =>\n      String(188 + i).padStart(5, "0")),\n  ].map((n) => ({\n    src: \`/images/bugs_..._\${n}.jpg\`,\n    alt: \`Bugs Bunny frame \${n}\`,\n  }));`,
	};

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
					<span aria-hidden="true"> ↗</span>
					<span className="sr-only"> (opens in a new tab)</span>
				</a>
			</header>

			<main id="main-content" className="examples">
				{/* ── Example 1: Hover mode ─────────────────────── */}
				<section className="example">
					<h2>Hover Mode</h2>
					<p>
						Images auto-cycle on a timer when you hover over the container.
						A progress bar displays while images preload. Also supports
						keyboard navigation — use the arrow keys to step through frames,
						or <kbd>Home</kbd>/<kbd>End</kbd> to jump to the first or last
						frame.
					</p>

					<div className="preview-row">
						<div className="preview-box">
							<FlipPreviewer
								mode="hover"
								images={popeye}
								width={320}
								height={240}
								onIndexChange={setHoverIndex}
							/>
						</div>
						<span className="frame-info">
							Frame: {hoverIndex + 1} / {popeye.length}
						</span>
					</div>

					<CodeBlock variables={[popeyeVar]}>{`<FlipPreviewer
  mode="hover"
  images={popeye}
  width={320}
  height={240}
/>`}</CodeBlock>
				</section>

				{/* ── Example 2: Hover mode (fast, no progress) ── */}
				<section className="example">
					<h2>Hover Mode — With Delay, No Progress Bar</h2>
					<p>
						The <code>delay</code> prop controls playback speed in milliseconds
						between frames — useful for slower, more deliberate reveals. Here
						the progress bar is hidden
						with <code>showProgress=&#123;false&#125;</code>.
					</p>

					<div className="preview-row">
						<div className="preview-box">
							<FlipPreviewer
								mode="hover"
								images={trainRobbery}
								width={320}
								height={180}
								delay={100}
								showProgress={false}
								onIndexChange={setDelayIndex}
							/>
						</div>
						<span className="frame-info">
							Frame: {delayIndex + 1} / {trainRobbery.length}
						</span>
					</div>

					<CodeBlock variables={[trainRobberyVar]}>{`<FlipPreviewer
  mode="hover"
  images={trainRobbery}
  width={320}
  height={180}
  delay={100}
  showProgress={false}
/>`}</CodeBlock>
				</section>

				{/* ── Example 3: Position mode ───────────────────── */}
				<section className="example">
					<h2>Position Mode</h2>
					<p>
						The active image changes based on your horizontal mouse or touch
						position within the container. Move left-to-right across the image,
						or use the arrow keys and <kbd>Home</kbd>/<kbd>End</kbd> for
						keyboard control.
					</p>

					<div className="preview-row">
						<div className="preview-box">
							<FlipPreviewer
								mode="position"
								images={bugsBunny}
								width={480}
								height={360}
								debug
								onIndexChange={setPosIndex}
							/>
						</div>
						<span className="frame-info">
							Frame: {posIndex + 1} / {bugsBunny.length}
						</span>
					</div>

					<CodeBlock variables={[bugsBunnyVar]}>{`<FlipPreviewer
  mode="position"
  images={bugsBunny}
  width={480}
  height={360}
  debug
/>`}</CodeBlock>
				</section>

				{/* ── Example 4: Position mode, no cursor ─────── */}
				<section className="example">
					<h2>Position Mode — No Cursor</h2>
					<p>
						Same as position mode but with the horizontal resize cursor disabled
						via <code>showCursor=&#123;false&#125;</code>. Useful when embedding
						the previewer in a context where the resize cursor would be
						confusing.
					</p>

					<div className="preview-row">
						<div className="preview-box">
							<FlipPreviewer
								mode="position"
								images={bugsBunny}
								width={480}
								height={360}
								showCursor={false}
								onIndexChange={setNoCursorIndex}
							/>
						</div>
						<span className="frame-info">
							Frame: {noCursorIndex + 1} / {bugsBunny.length}
						</span>
					</div>

					<CodeBlock variables={[bugsBunnyVar]}>{`<FlipPreviewer
  mode="position"
  images={bugsBunny}
  width={480}
  height={360}
  showCursor={false}
/>`}</CodeBlock>
				</section>

				{/* ── Example 5: Hover mode with autoPlay ──────── */}
				<section className="example">
					<h2>Hover Mode — Auto Play</h2>
					<p>
						Starts animating automatically on mount without requiring a hover.
						Ideal for hero banners, product showcases, or anywhere you want
						motion on load.
					</p>

					<div className="preview-row">
						<div className="preview-box">
							<FlipPreviewer
								mode="hover"
								images={popeye}
								width={320}
								height={240}
								delay={150}
								autoPlay
								onIndexChange={setAutoPlayIndex}
							/>
						</div>
						<span className="frame-info">
							Frame: {autoPlayIndex + 1} / {popeye.length}
						</span>
					</div>

					<CodeBlock variables={[popeyeVar]}>{`<FlipPreviewer
  mode="hover"
  images={popeye}
  width={320}
  height={240}
  delay={150}
  autoPlay
/>`}</CodeBlock>
				</section>
			</main>

			<footer className="footer">
				<p>
					&copy; {new Date().getFullYear()}{" "}
					<a
						href="https://github.com/cjboco"
						target="_blank"
						rel="noopener noreferrer"
					>
						Creative Juices Bo. Co.
						<span className="sr-only"> (opens in a new tab)</span>
					</a>{" "}
					&mdash; BSD-3-Clause License
				</p>
			</footer>
		</div>
	);
}

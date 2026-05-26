import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { FlipPreviewer } from "cj-image-flip-previewer";
const BASE = import.meta.env.BASE_URL;
const bettyBoop = [
    "000030", "000060", "000090", "000120", "000150", "000180", "000210",
    "000240", "000270", "000300", "000330", "000360", "000390", "000420", "000450",
].map((n) => ({
    src: `${BASE}images/bb_minnie_the_moocher_${n}.jpg`,
    alt: `Betty Boop frame ${n}`,
}));
const superman = [
    "000030", "000120", "000150", "000210", "000240", "000270", "000300", "000330",
].map((n) => ({
    src: `${BASE}images/superman_the_mechanical_monsters_${n}.jpg`,
    alt: `Superman frame ${n}`,
}));
const bugsBunny = [
    "00027", ...Array.from({ length: 23 }, (_, i) => String(188 + i).padStart(5, "0")),
].map((n) => ({
    src: `${BASE}images/bugs_bunny_${n}.jpg`,
    alt: `Bugs Bunny frame ${n}`,
}));
function CodeBlock({ children }) {
    return (_jsx("pre", { className: "code-block", children: _jsx("code", { children: children.trim() }) }));
}
export function App() {
    const [hoverIndex, setHoverIndex] = useState(0);
    return (_jsxs("div", { className: "app", children: [_jsxs("header", { className: "header", children: [_jsx("h1", { children: "CJ Image Flip Previewer" }), _jsx("p", { className: "subtitle", children: "React components for interactive image previews \u2014 flip through images by mouse position or animate frames on hover like a video previewer." }), _jsx("a", { href: "https://github.com/cjboco/cj-image-flip-previewer", className: "github-link", target: "_blank", rel: "noopener noreferrer", children: "View on GitHub" })] }), _jsxs("main", { className: "examples", children: [_jsxs("section", { className: "example", children: [_jsx("h2", { children: "Hover Mode" }), _jsx("p", { children: "Images auto-cycle on a timer when you hover over the container. Includes a progress bar while images preload." }), _jsxs("div", { className: "preview-row", children: [_jsx("div", { className: "preview-box small", children: _jsx(FlipPreviewer, { mode: "hover", images: bettyBoop, width: 160, height: 110, onIndexChange: setHoverIndex }) }), _jsxs("span", { className: "frame-info", children: ["Frame: ", hoverIndex + 1, " / ", bettyBoop.length] })] }), _jsx(CodeBlock, { children: `<FlipPreviewer
  mode="hover"
  images={bettyBoop}
  width={160}
  height={110}
/>` })] }), _jsxs("section", { className: "example", children: [_jsx("h2", { children: "Hover Mode \u2014 Fast, No Progress Bar" }), _jsx("p", { children: "A faster delay with the progress indicator disabled." }), _jsx("div", { className: "preview-row", children: _jsx("div", { className: "preview-box small", children: _jsx(FlipPreviewer, { mode: "hover", images: superman, width: 160, height: 110, delay: 100, showProgress: false }) }) }), _jsx(CodeBlock, { children: `<FlipPreviewer
  mode="hover"
  images={superman}
  width={160}
  height={110}
  delay={100}
  showProgress={false}
/>` })] }), _jsxs("section", { className: "example", children: [_jsx("h2", { children: "Position Mode" }), _jsx("p", { children: "The active image changes based on your horizontal mouse position within the container. Move your mouse left-to-right across the image." }), _jsx("div", { className: "preview-row", children: _jsx("div", { className: "preview-box large", children: _jsx(FlipPreviewer, { mode: "position", images: bugsBunny, width: 320, height: 240, debug: true }) }) }), _jsx(CodeBlock, { children: `<FlipPreviewer
  mode="position"
  images={bugsBunny}
  width={320}
  height={240}
  debug
/>` })] }), _jsxs("section", { className: "example", children: [_jsx("h2", { children: "Hover Mode \u2014 Auto Play" }), _jsx("p", { children: "Starts animating automatically without requiring a hover." }), _jsx("div", { className: "preview-row", children: _jsx("div", { className: "preview-box small", children: _jsx(FlipPreviewer, { mode: "hover", images: bettyBoop, width: 160, height: 110, delay: 300, autoPlay: true }) }) }), _jsx(CodeBlock, { children: `<FlipPreviewer
  mode="hover"
  images={bettyBoop}
  width={160}
  height={110}
  delay={300}
  autoPlay
/>` })] })] }), _jsx("footer", { className: "footer", children: _jsxs("p", { children: ["\u00A9 ", new Date().getFullYear(), " ", _jsx("a", { href: "https://github.com/cjboco", target: "_blank", rel: "noopener noreferrer", children: "Creative Juices Bo. Co." }), " ", "\u2014 BSD-3-Clause License"] }) })] }));
}

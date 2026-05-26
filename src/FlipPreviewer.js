import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState, useCallback, useEffect, useImperativeHandle, } from "react";
export function FlipPreviewer({ mode = "position", images, width, height, fit = "cover", delay = 450, autoPlay = false, showProgress = true, debug = false, className, style, onIndexChange, onImagesLoaded, ref, }) {
    const containerRef = useRef(null);
    const timerRef = useRef(null);
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
    // ── Hover mode: timer-based animation ────────────────────────
    const clearTimer = useCallback(() => {
        if (timerRef.current !== null) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);
    const advanceFrame = useCallback(() => {
        if (!isPlayingRef.current)
            return;
        if (images.length <= 1)
            return;
        const next = activeIndexRef.current + 1 >= images.length
            ? 0
            : activeIndexRef.current + 1;
        activeIndexRef.current = next;
        setActiveIndex(next);
        onIndexChange?.(next);
        timerRef.current = setTimeout(advanceFrame, delay);
    }, [images.length, delay, onIndexChange]);
    const startAnimation = useCallback(() => {
        if (!allLoaded || images.length <= 1)
            return;
        isPlayingRef.current = true;
        clearTimer();
        timerRef.current = setTimeout(advanceFrame, delay);
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
    useImperativeHandle(ref, () => ({
        start: startAnimation,
        pause: stopAnimation,
    }), [startAnimation, stopAnimation]);
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
    const handlePointerMove = useCallback((e) => {
        if (mode !== "position")
            return;
        const container = containerRef.current;
        if (!container || images.length === 0)
            return;
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
            setDebugInfo(`x:${Math.round(x)}, y:${Math.round(y)}, idx:${pos}/${images.length}, w:${Math.round(rect.width)}, h:${Math.round(rect.height)}`);
        }
    }, [mode, images.length, debug, onIndexChange]);
    // Reset index if images change
    // biome-ignore lint/correctness/useExhaustiveDependencies: intentional trigger when images change
    useEffect(() => {
        setActiveIndex(0);
        activeIndexRef.current = 0;
    }, [images]);
    // ── Render ───────────────────────────────────────────────────
    if (images.length === 0)
        return null;
    const activeImage = images[activeIndex];
    const hasLink = !!activeImage.href;
    const containerStyle = {
        position: "relative",
        width: width ?? "100%",
        height: height ?? "100%",
        overflow: "hidden",
        cursor: hasLink || mode === "position" ? "pointer" : "default",
        ...style,
    };
    const imgElement = (_jsx("img", { src: activeImage.src, alt: activeImage.alt ?? "", className: "cj-flip-previewer__img", style: { objectFit: fit }, draggable: false }));
    const content = hasLink ? (_jsx("a", { href: activeImage.href, title: activeImage.title, target: activeImage.target, rel: activeImage.rel, className: "cj-flip-previewer__link", children: imgElement })) : (imgElement);
    const progressPct = images.length > 0 ? (loadedCount / images.length) * 100 : 0;
    return (
    // biome-ignore lint/a11y/noStaticElementInteractions: container tracks pointer position for image flipping
    _jsxs("div", { ref: containerRef, className: `cj-flip-previewer${className ? ` ${className}` : ""}`, style: containerStyle, onPointerMove: handlePointerMove, onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave, children: [content, mode === "hover" && showProgress && !allLoaded && (_jsx("div", { className: "cj-flip-previewer__progress", children: _jsx("div", { className: "cj-flip-previewer__progress-bar", style: { width: `${progressPct}%` } }) })), mode === "position" && debug && (_jsx("div", { className: "cj-flip-previewer__debug", children: debugInfo }))] }));
}

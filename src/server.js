import { readdir } from "node:fs/promises";
import { extname, posix } from "node:path";
const IMAGE_EXTENSIONS = new Set([
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".avif",
    ".svg",
    ".bmp",
    ".ico",
]);
/**
 * Reads a directory on the server and returns a sorted array of
 * `FlipPreviewerImage` objects suitable for passing to `<FlipPreviewer>`.
 *
 * @param fsPath - Absolute or relative filesystem path to the image directory
 * @param urlPrefix - URL path prefix for the images (e.g., "/photos")
 */
export async function getImagesFromDirectory(fsPath, urlPrefix) {
    const entries = await readdir(fsPath, { withFileTypes: true });
    const images = [];
    for (const entry of entries) {
        if (!entry.isFile())
            continue;
        const ext = extname(entry.name).toLowerCase();
        if (!IMAGE_EXTENSIONS.has(ext))
            continue;
        const src = posix.join(urlPrefix.endsWith("/") ? urlPrefix : urlPrefix + "/", entry.name);
        images.push({ src, alt: entry.name });
    }
    images.sort((a, b) => a.src.localeCompare(b.src));
    return images;
}

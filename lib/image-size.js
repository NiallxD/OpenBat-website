// Intrinsic width and height of a local image, read from its header.
//
// The app renders post bodies in a web view and asks for width/height on every
// <img> so its layout doesn't jump while the photographs load. The website
// doesn't need them (CSS sizes the images), so nothing is stored anywhere —
// the few bytes at the front of each file are read at build time instead, and
// that is cheaper than a dependency.

import { readFileSync } from "fs";

const cache = new Map();

function read(buf) {
  // PNG
  if (buf.length >= 24 && buf.readUInt32BE(0) === 0x89504e47) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  // GIF
  if (buf.length >= 10 && buf.toString("ascii", 0, 3) === "GIF") {
    return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) };
  }
  // WebP — three flavours, all behind the same RIFF header.
  if (buf.length >= 30 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    const kind = buf.toString("ascii", 12, 16);
    if (kind === "VP8X") {
      return {
        width: (buf.readUIntLE(24, 3) & 0xffffff) + 1,
        height: (buf.readUIntLE(27, 3) & 0xffffff) + 1,
      };
    }
    if (kind === "VP8 " && buf[23] === 0x9d && buf[24] === 0x01 && buf[25] === 0x2a) {
      return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
    }
    if (kind === "VP8L" && buf[20] === 0x2f) {
      const bits = buf.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
    return null;
  }
  // JPEG — walk the segments to the start-of-frame, which is the only one
  // that carries the dimensions.
  if (buf.length >= 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) { i++; continue; }
      const marker = buf[i + 1];
      if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) { i += 2; continue; }
      const len = buf.readUInt16BE(i + 2);
      const isSOF = marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);
      if (isSOF) return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
      i += 2 + len;
    }
  }
  return null;
}

// Returns {width, height} or null — null for anything unreadable, missing or
// in a format not handled here (SVG has no intrinsic pixel size anyway).
export function imageSize(path) {
  if (cache.has(path)) return cache.get(path);
  let out = null;
  try {
    out = read(readFileSync(path).subarray(0, 4096));
  } catch {
    out = null;
  }
  if (out && (!out.width || !out.height)) out = null;
  cache.set(path, out);
  return out;
}

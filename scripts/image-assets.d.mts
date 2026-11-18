import type { Plugin } from "vite";

export interface OptimizedGameImage {
  data: Uint8Array;
  originalBytes: number;
  outputBytes: number;
  width: number | undefined;
  height: number | undefined;
  trimmed: boolean;
  resized: boolean;
}

export function optimizeGameImage(input: Uint8Array): Promise<OptimizedGameImage>;
export function gameImageAssets(): Plugin;

/// <reference types="vite/client" />

declare module "virtual:perk-atlas" {
  export const url: string;
  export const names: readonly string[];
  export const columns: number;
  export const rows: number;
}

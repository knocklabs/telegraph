/* eslint-disable @typescript-eslint/no-explicit-any */
// Ambient declarations for Telegraph packages that don't ship their own .d.ts files.
// This prevents TypeScript compile errors in the builder app when we reference them
// (e.g., via dynamic evaluation of generated code).

declare module "@telegraph/layer" {
  const mod: any;
  export = mod;
}

declare module "@telegraph/style-engine" {
  const mod: any;
  export = mod;
}

declare module "@telegraph/nextjs" {
  const mod: any;
  export = mod;
}

declare module "@telegraph/vite-config" {
  const mod: any;
  export = mod;
}

declare module "@telegraph/postcss-config" {
  const mod: any;
  export = mod;
}

declare module "@telegraph/prettier-config" {
  const mod: any;
  export = mod;
}

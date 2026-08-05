// Ambient declaration for side-effect CSS imports (the lazily-loaded
// page-transition styles carry no type surface), so `tsc` under NodeNext
// resolution doesn't flag `import "./Combobox.pageTransition.css"`.
declare module "*.css";

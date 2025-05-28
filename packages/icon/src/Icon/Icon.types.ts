// These types are used to convert a kebab-cased string to a PascalCase string
// specifically for the Lucide icons. We do it in this way to maintain backwards
// compatibility with the `Lucide.Bell` pattern. Leaving here for now as it doesn't
// seem like a utility type that would be useful outside of this context.
export type KebabToPascalCase<S extends string> =
  S extends `${infer Head}-${infer Tail}`
    ? `${Capitalize<Head>}${KebabToPascalCase<Capitalize<Tail>>}`
    : Capitalize<S>;

export type TransformKeysToPascal<T> = {
  [K in keyof T as KebabToPascalCase<K & string>]: T[K];
};

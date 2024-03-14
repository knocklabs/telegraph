// If only T is passed, make all properties required, if K is passed, make only those properties required
export type Required<T, K = Record<string, unknown>> = K extends keyof T
  ? Omit<T, K> & Required<Pick<T, K>>
  : { [P in keyof T]-?: T[P] };

// If only T is passed, make all properties optional, if K is passed, make only those properties optional
export type Optional<T, K extends keyof T> = K extends keyof T
  ? Omit<T, K> & Partial<Pick<T, K>>
  : { [P in keyof T]?: T[P] };

// The `as` prop is a generic prop that allows you to change the underlying
// element of a component. This is useful for creating a component that can
// be used as a button, link, or any other element.
export type AsProp<C extends React.ElementType> = {
  as?: C;
};

// The `PropsWithAs` type is a utility type that allows you to create a
// component that can be used as a button, link, or any other element.
// It takes a generic type `C` that extends `React.ElementType` and a
// generic type `P` that extends `object`. It returns a type that includes
// the `as` prop and all the props of the underlying element type `C`.
// This allows you to create a component that can be used as a button, link,
// or any other element, and pass all the props of the underlying element type.
export type PropsWithAs<C extends React.ElementType, P> = AsProp<C> &
  Omit<React.ComponentProps<C>, keyof AsProp<C>> &
  P;


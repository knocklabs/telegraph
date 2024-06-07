import type React from "react";

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

export type RequiredAsProp<C extends React.ElementType> = {
  as: C;
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

export type PropsWithRequiredAs<
  C extends React.ElementType,
  P,
> = RequiredAsProp<C> &
  Omit<React.ComponentProps<C>, keyof RequiredAsProp<C>> &
  P;

// The `ComponentPropsWithAs` type is a utility type that combines the
// props of a given component type `P` with the `as` prop functionality.
// It allows for flexible component usage by including both the `as` prop
// and the props of the component `P`.
export type ComponentPropsWithAs<
  P extends React.ElementType,
  // eslint-disable-next-line
  O = {},
> = PropsWithAs<React.ElementType, React.ComponentProps<P> & O>;

export type ComponentPropsWithRequiredAs<
  P extends React.ElementType,
  // eslint-disable-next-line
  O = {},
> = PropsWithRequiredAs<React.ElementType, React.ComponentProps<P> & O>;

//  The `RefWithAs` type is a utility type that derives the ref type for a given
//  component type `P` by using `React.ElementRef`. This ensures the ref type
// is correctly associated with the component's underlying element type.
export type RefWithAs<P extends React.ElementType> = React.ElementRef<P>;

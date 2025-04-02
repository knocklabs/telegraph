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

// Allow for internal config of the as prop for use
// when extending this component
export type OptionalAsPropConfig<E extends React.ElementType> =
  | { as?: E; internal_optionalAs: true }
  | { as: E; internal_optionalAs?: never };

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

// The `PolymorphicProps` type is a utility type that allows you to create a
// component that can be used as a button, link, or any other element via
// the `as` prop. It takes a generic type `E` that extends `React.ElementType`.
// It returns a type that includes the `as` prop and all the props of the
// underlying element type `E`.
export type PolymorphicProps<E extends React.ElementType> = Omit<
  React.ComponentProps<E>,
  "as"
> & {
  as?: E;
  children?: React.ReactNode;
};

// The `PolymorphicPropsWithTgphRef` type is a utility type that allows you to create a
// component that can be used as a button, link, or any other element via
// the `as` prop. It takes a generic type `E` that extends `React.ElementType`.
// It returns a type that includes the `as` prop and all the props of the
// underlying element type `E`. It also includes a `tgpRef` prop that allows you to
// pass a ref to the component.
export type PolymorphicPropsWithTgphRef<
  E extends React.ElementType,
  R extends HTMLElement | React.ElementType,
> = {
  tgphRef?: React.Ref<R>;
} & PolymorphicProps<E>;

export type TgphComponentProps<T extends React.ElementType> =
  React.ComponentProps<T>;

// The `TgphElement` is a wrapper on the React.ElementType type that allows you to
// pass a component as a prop to another component.
export type TgphElement = React.ElementType;

// The `RemappedOmit` type is a utility type that allows you to remove specific
// fields from a type. Unlike the standard `Omit` type, this ensures the removed
// fields are completely eliminated rather than potentially resolving to
// `Record<string, any>`. It takes a type `T` and a union of property keys `K`
// to remove from that type.
export type RemappedOmit<T, K extends PropertyKey> = {
  [P in keyof T as P extends K ? never : P]: T[P];
};

import type { Responsive } from "../types";

type OrganizeComponentAndStylePropsArgs = {
  props: Record<string, unknown>;
  propsMap: Record<string, unknown>;
};

export const organizeComponentAndStyleProps = ({
  props,
  propsMap,
}: OrganizeComponentAndStylePropsArgs) => {
  const organizedProps = Object.keys(props).reduce(
    (acc, key) => {
      if (!Object.keys(propsMap).some((prop) => prop === key)) {
        acc.component[key] = props[key];
      } else {
        acc.style[key] = props[key] as Responsive<string>;
      }
      return acc;
    },
    { style: {}, component: {} } as {
      style: Record<string, Responsive<string>>;
      component: Record<string, unknown>;
    },
  );

  return organizedProps;
};

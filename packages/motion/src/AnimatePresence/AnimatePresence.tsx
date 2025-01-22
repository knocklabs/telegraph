import React from "react";

const recursivelyGetMotionElements = (
  children: React.ReactNode,
  elements: Array<React.ReactNode> = [],
) => {
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      if ((child.type as React.ComponentType<unknown>).name === "Motion") {
        elements.push(child);
      }

      const childElements = React.Children.toArray(child.props.children);

      childElements.forEach((childElement) => {
        if (React.isValidElement(childElement)) {
          recursivelyGetMotionElements(childElement, elements);
        }
      });
    }
  });

  return elements;
};

const recursivleySetStatusProp = (
  status: "initial" | "animate" | "exit",
  children: React.ReactElement | React.ReactNode,
  keys: Array<string> = [],
  duration: number = 0,
) => {
  const isValidElement = (
    child: React.ReactNode,
  ): child is React.ReactElement => React.isValidElement(child);

  const traverse = (node: React.ReactNode): React.ReactNode => {
    if (Array.isArray(node)) {
      // If the node is an array, map through its children
      return node.map(traverse);
    }

    if (isValidElement(node)) {
      const formattedKey = `.$${node.key}`;
      const bareKey = node.key;

      // If the key is in the keys array, update the status prop
      if (
        (bareKey !== null && keys.includes(bareKey)) ||
        (formattedKey !== null && keys.includes(formattedKey))
      ) {
        const nodeTransitionDuration = node?.props?.transition?.duration;
        if (nodeTransitionDuration > duration) {
          duration = nodeTransitionDuration;
        }
        return React.cloneElement(node, { status });
      }

      // Recursively traverse the children
      if (node.props.children) {
        const updatedChildren = traverse(node.props.children);
        return React.cloneElement(node, { children: updatedChildren });
      }
    }

    // If it's not a React element, return it as is
    return node;
  };

  return { children: traverse(children), duration };
};

type AnimatePresenceProps = {
  children: React.ReactNode;
};

const AnimatePresence = ({ children }: AnimatePresenceProps) => {
  const [allChildren, setAllChildren] = React.useState(children);

  React.useEffect(() => {
    const newMotionElements = recursivelyGetMotionElements(children);
    const oldMotionElements = recursivelyGetMotionElements(allChildren);

    const addedMotionElementsKeys = newMotionElements
      .filter((element) => {
        if (React.isValidElement(element)) {
          const hasKey = element.key !== null;
          const includesMotionElements = oldMotionElements.includes(element);
          return hasKey && !includesMotionElements;
        }
        return false;
      })
      .map((element) => (element as React.ReactElement)?.key as string);

    if (addedMotionElementsKeys.length > 0) {
      const { children: newChildren } = recursivleySetStatusProp(
        "initial",
        children,
        addedMotionElementsKeys,
      );

      setAllChildren(newChildren);
    }

    const removedMotionElementsKeys = oldMotionElements
      .filter((element) => {
        if (React.isValidElement(element)) {
          const hasKey = element.key !== null;
          const includesMotionElements = newMotionElements.includes(element);
          return hasKey && !includesMotionElements;
        }
        return false;
      })
      .map((element) => (element as React.ReactElement)?.key as string);

    if (removedMotionElementsKeys.length > 0) {
      const { children: newChildren, duration } = recursivleySetStatusProp(
        "exit",
        allChildren,
        removedMotionElementsKeys,
      );

      setAllChildren(newChildren);

      const timeout = setTimeout(() => {
        setAllChildren(children);
      }, duration);

      return () => clearTimeout(timeout);
    }

    // If we add `allChildren` to the dependency array, we will get a infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  return <>{allChildren}</>;
};

export { AnimatePresence };

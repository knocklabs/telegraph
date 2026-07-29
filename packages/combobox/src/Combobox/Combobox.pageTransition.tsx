import { type ReactNode, useLayoutEffect, useRef } from "react";

import "./Combobox.pageTransition.css";

const SLIDE_MS = 240;
const SLIDE_EASING = "cubic-bezier(0.16, 1, 0.3, 1)";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;

// The active `Combobox.Page` panel. Default export so `Combobox.Page` can pull
// it in with `React.lazy` — the wrapper JS and its CSS then ship as a separate
// chunk that loads only for multi-page comboboxes.
//
// On mount it plays the CSS slide-in. On unmount (its page switched away) it
// leaves behind a static clone of itself that slides out the opposite side,
// giving a lockstep in/out transition. The clone is detached, inert DOM — no
// Base UI items, no interaction — so the engine's item registry is untouched.
// The popup's height is animated separately by `Combobox.Content`'s `min-height`
// transition. `role="presentation"` keeps the wrapper out of the a11y tree so
// the listbox still owns its options directly.
const PageTransition = ({
  direction,
  children,
}: {
  direction?: "forward" | "back";
  children: ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const node = ref.current;
    return () => {
      const parent = node?.parentElement;
      // Skip the slide-out when there is no Web Animations API (jsdom, older
      // engines) or the user prefers reduced motion.
      if (
        !node ||
        !parent ||
        prefersReducedMotion() ||
        typeof node.animate !== "function"
      ) {
        return;
      }

      // The switch direction is published on the popup content synchronously by
      // the switch handler (the incoming panel isn't in the DOM yet at this
      // cleanup). Absent means an open/close rather than a switch — don't slide.
      // On unmount `node` is still attached (React removes it after cleanup), so
      // it can be snapshotted into a sliding clone.
      const dir = node
        .closest("[data-tgph-combobox-content]")
        ?.getAttribute("data-tgph-combobox-page-slide-direction");
      if (dir !== "forward" && dir !== "back") return;

      const clone = node.cloneNode(true) as HTMLElement;
      clone.removeAttribute("data-tgph-combobox-page-panel");
      clone.setAttribute("data-tgph-combobox-page-panel-clone", "");
      clone.setAttribute("aria-hidden", "true");
      clone.style.top = `${node.offsetTop}px`;
      clone.style.left = `${node.offsetLeft}px`;
      clone.style.width = `${node.offsetWidth}px`;
      clone.style.height = `${node.offsetHeight}px`;
      parent.appendChild(clone);

      // Clip the outgoing clone's vertical extent while it slides, so a taller
      // outgoing page can't surface a scrollbar as the popup resizes to a
      // shorter one. Restored once the clone is gone.
      const prevOverflowY = parent.style.overflowY;
      parent.style.overflowY = "hidden";

      const slideOut =
        dir === "forward" ? "translateX(-100%)" : "translateX(100%)";
      const animation = clone.animate(
        [{ transform: "translateX(0)" }, { transform: slideOut }],
        { duration: SLIDE_MS, easing: SLIDE_EASING },
      );
      const finish = () => {
        clone.remove();
        // Only restore once no clone remains (rapid switches overlap).
        if (!parent.querySelector("[data-tgph-combobox-page-panel-clone]")) {
          parent.style.overflowY = prevOverflowY;
        }
      };
      animation.finished.then(finish, finish);
    };
  }, []);

  return (
    <div
      ref={ref}
      role="presentation"
      data-tgph-combobox-page-panel
      data-tgph-combobox-page-direction={direction}
    >
      {children}
    </div>
  );
};

export default PageTransition;

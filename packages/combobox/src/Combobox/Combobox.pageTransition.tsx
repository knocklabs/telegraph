import { type ReactNode, useLayoutEffect, useRef } from "react";

import "./Combobox.pageTransition.css";

const SLIDE_MS = 240;
const SLIDE_EASING = "cubic-bezier(0.16, 1, 0.3, 1)";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;

// The active `Combobox.Page` panel. Exported by name so `Combobox.Page` can pull
// it in with `React.lazy` while mapping around NodeNext's CommonJS interop. The
// wrapper JS and its CSS then ship as a separate
// chunk that loads only for multi-page comboboxes.
//
// On mount it plays the CSS slide-in. On unmount (its page switched away) it
// leaves behind a static clone of itself that slides out the opposite side,
// giving a lockstep in/out transition. The clone is detached, inert DOM — no
// Base UI items, no interaction — so the engine's item registry is untouched.
// The popup's height is animated separately by `Combobox.Content`'s `min-height`
// transition. `role="presentation"` keeps the wrapper out of the a11y tree so
// the listbox still owns its options directly.
export const PageTransition = ({
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
      const content = node.closest("[data-tgph-combobox-content]");
      const dir = content?.getAttribute(
        "data-tgph-combobox-page-slide-direction",
      );
      if (dir !== "forward" && dir !== "back") return;
      // Consume the direction so a later unmount that isn't a switch — the popup
      // closing — can't replay a stale slide-out. Each real switch republishes it
      // before `setPage`, so this only clears spent state.
      content?.removeAttribute("data-tgph-combobox-page-slide-direction");

      // Clip the outgoing clone's vertical extent while it slides, so a taller
      // outgoing page can't surface a scrollbar as the popup resizes to a
      // shorter one. A rapid re-switch would otherwise stack un-cancelled clones
      // and — because each snapshotted the live (already-"hidden") overflow —
      // leave the list stuck unscrollable. So cancel any in-flight clone first,
      // and capture the TRUE original overflow only when none is mid-slide, so
      // every overlapping clone shares it and the last one restores it.
      const inFlight = parent.querySelector(
        "[data-tgph-combobox-page-panel-clone]",
      );
      if (inFlight) {
        inFlight.getAnimations?.().forEach((animation) => animation.cancel());
        inFlight.remove();
      } else {
        parent.dataset.tgphPagePrevOverflowY = parent.style.overflowY;
      }
      parent.style.overflowY = "hidden";

      const clone = node.cloneNode(true) as HTMLElement;
      clone.removeAttribute("data-tgph-combobox-page-panel");
      clone.setAttribute("data-tgph-combobox-page-panel-clone", "");
      clone.setAttribute("aria-hidden", "true");
      clone.style.top = `${node.offsetTop}px`;
      clone.style.left = `${node.offsetLeft}px`;
      clone.style.width = `${node.offsetWidth}px`;
      clone.style.height = `${node.offsetHeight}px`;
      parent.appendChild(clone);

      const slideOut =
        dir === "forward" ? "translateX(-100%)" : "translateX(100%)";
      const animation = clone.animate(
        [{ transform: "translateX(0)" }, { transform: slideOut }],
        { duration: SLIDE_MS, easing: SLIDE_EASING },
      );
      const finish = () => {
        clone.remove();
        // Restore the original overflow only once the last clone is gone.
        if (!parent.querySelector("[data-tgph-combobox-page-panel-clone]")) {
          parent.style.overflowY = parent.dataset.tgphPagePrevOverflowY ?? "";
          delete parent.dataset.tgphPagePrevOverflowY;
        }
      };
      // `.finished` can be absent on very old WAAPI engines even when `.animate`
      // exists; remove the clone immediately then instead of throwing.
      if (animation.finished) {
        animation.finished.then(finish, finish);
      } else {
        finish();
      }
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

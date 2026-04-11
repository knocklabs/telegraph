import { addons } from "storybook/manager-api";

addons.setConfig({});

// Hide the type icons (document, story, component, group) from sidebar tree items
const style = document.createElement("style");
style.textContent = `
  [data-nodetype] svg {
    display: none !important;
  }
  [data-testid="tree-status-button"] svg,
  [data-testid="context-menu"] svg {
    display: initial !important;
  }
`;
document.head.appendChild(style);

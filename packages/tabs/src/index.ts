import { Tab } from "./Tab";
import { TabList } from "./TabList";
import { TabPanel, Tabs } from "./Tabs";

// Main component with nested properties
const TabsComponent = Object.assign(Tabs, {
  Tab,
  List: TabList,
  Panel: TabPanel,
});

export { TabsComponent as Tabs };

import {
  registerHtml,
  TramOneComponent,
  useEffect,
  useGlobalStore,
} from "tram-one";
import noteSelector from "../note-selector";
import pageScroller from "../page-scroller";
import page from "../page";
import "./app.css";

const html = registerHtml({
  "note-selector": noteSelector,
  "page-scroller": pageScroller,
  page: page,
});

type TabGroup = chrome.tabGroups.TabGroup;
type Tab = chrome.tabs.Tab;

export interface PageGroup extends TabGroup {
  tabs?: Tab[];
}

const newUngroupedTabGroup: () => TabGroup = () => ({
  collapsed: false,
  color: "grey",
  id: -1,
  title: undefined,
  windowId: -1,
});

const app: TramOneComponent = () => {
  const groupStore = useGlobalStore("GROUP_STORE", [] as TabGroup[]);
  const tabStore = useGlobalStore("TAB_STORE", [] as Tab[]);

  useEffect(async () => {
    // tab information
    const tabs = await chrome.tabs.query({});
    tabStore.push(...tabs);

    // group information
    const tabGroups = await chrome.tabGroups.query({});
    groupStore.push(...tabGroups);
  });

  const pageGroups = [] as PageGroup[];
  tabStore.forEach((tab) => {
    const lastGroup = pageGroups.at(-1);

    if (lastGroup === undefined || lastGroup.id !== tab.groupId) {
      // if we have a new group, make a new page for it

      // get the group the tab is pointing to (or a new one, if this isn't part of a group)
      const newTabGroup =
        (groupStore.find((group) => group.id === tab.groupId) as PageGroup) ||
        (newUngroupedTabGroup() as PageGroup);

      newTabGroup.tabs = [tab];
      pageGroups.push(newTabGroup);
    } else {
      // if the tab is in the last associated group, push this tab on it
      lastGroup.tabs.push(tab);
    }
  }, []);

  const pages = pageGroups.map((group) => {
    return html`<page groupInfo=${group} />`;
  });

  return html`
    <main class="app">
      <page-scroller> ${pages} </page-scroller>
    </main>
  `;
};

export default app;

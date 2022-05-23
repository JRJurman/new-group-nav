import {
  registerHtml,
  TramOneComponent,
  useEffect,
  useGlobalStore,
} from "tram-one";
import noteSelector from "../note-selector";
import pageScroller from "../page-scroller";
import page, { collapsedPage } from "../page";
import "./app.css";

const html = registerHtml({
  "note-selector": noteSelector,
  "page-scroller": pageScroller,
  page: page,
  "collapsed-page": collapsedPage,
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
  const pageGroups = useGlobalStore("PAGE_GROUPS", [] as PageGroup[]);

  useEffect(async () => {
    // tab information
    const tabs = await chrome.tabs.query({});

    // group information
    const tabGroups = await chrome.tabGroups.query({});

    tabs.forEach((tab) => {
      const lastGroup = pageGroups.at(-1);

      if (lastGroup === undefined || lastGroup.id !== tab.groupId) {
        // if we have a new group, make a new page for it

        // get the group the tab is pointing to (or a new one, if this isn't part of a group)
        const newTabGroup =
          (tabGroups.find((group) => group.id === tab.groupId) as PageGroup) ||
          (newUngroupedTabGroup() as PageGroup);

        newTabGroup.tabs = [tab];
        pageGroups.push(newTabGroup);
      } else {
        // if the tab is in the last associated group, push this tab on it
        lastGroup.tabs.push(tab);
      }
    }, []);
  });

  const pages = pageGroups.map((group) => {
    if (group.collapsed) {
      return html`<collapsed-page groupInfo=${group} />`;
    }
    return html`<page groupInfo=${group} />`;
  });

  return html`
    <main class="app">
      <page-scroller> ${pages} </page-scroller>
    </main>
  `;
};

export default app;

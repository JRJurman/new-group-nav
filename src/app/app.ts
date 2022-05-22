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

const ungroupedTabGroup: TabGroup = {
  collapsed: false,
  color: "grey",
  id: -1,
  title: undefined,
  windowId: -1,
};

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

  const pageGroups = [...groupStore, ungroupedTabGroup];
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

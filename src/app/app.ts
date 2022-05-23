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
  notes?: string;
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

  // fetch tab and group information
  useEffect(async () => {
    // tab information
    const tabs = await chrome.tabs.query({});

    // group information
    const tabGroups = await chrome.tabGroups.query({});

    // storage information (includes the notes)
    const notes = await chrome.storage.local.get();

    // populate the pageGroups by iterating through the tabs
    // this way they are in the order that they appear in the window
    tabs.forEach((tab) => {
      const lastGroup = pageGroups.at(-1);

      if (lastGroup === undefined || lastGroup.id !== tab.groupId) {
        // if we have a new group, make a new page for it

        // get the group the tab is pointing to (or a new one, if this isn't part of a group)
        const newTabGroup =
          (tabGroups.find((group) => group.id === tab.groupId) as PageGroup) ||
          (newUngroupedTabGroup() as PageGroup);

        newTabGroup.tabs = [tab];
        newTabGroup.notes = notes[newTabGroup.id];
        pageGroups.push(newTabGroup);
      } else {
        // if the tab is in the last associated group, push this tab on it
        lastGroup.tabs.push(tab);
      }
    }, []);
  });

  // load page notes live
  useEffect(async () => {
    console.log(`adding change listener`);

    const thisTab = await (
      await chrome.tabs.query({ active: true, lastFocusedWindow: true })
    ).at(0);

    // function to handle new changes we get to the chrome extension local storage
    const updatePageOnChanged = (changes) => {
      // iterate through the changes (chances are we'll only ever get one)
      Object.entries(changes).forEach(
        async ([groupId, change]: [string, any]) => {
          const targetGroup = pageGroups.find(
            (page) => page.id === parseInt(groupId)
          );

          // get the current active tab
          const activeTab = await (
            await chrome.tabs.query({ active: true, lastFocusedWindow: true })
          ).at(0);

          // if the active tab and current tab are different, we can update safely
          if (thisTab.id !== activeTab.id) {
            console.log(`live updating ${targetGroup.id}`);
            targetGroup.notes = change.newValue;
          }
        }
      );
    };

    // attach a listener for new changes
    chrome.storage.onChanged.addListener(updatePageOnChanged);
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

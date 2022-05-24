import {
  registerHtml,
  TramOneComponent,
  useEffect,
  useGlobalStore,
  useStore,
} from "tram-one";
import pageScroller from "../page-scroller";
import errorPage from "../error-page";
import page, { collapsedPage } from "../page";
import "./app.css";

const html = registerHtml({
  "page-scroller": pageScroller,
  page: page,
  "collapsed-page": collapsedPage,
  "error-page": errorPage,
});

type TabGroup = chrome.tabGroups.TabGroup;
type Tab = chrome.tabs.Tab;

export interface GroupPage extends TabGroup {
  tabs?: Tab[];
  notes?: string;
}

const app: TramOneComponent = () => {
  const groupPages = useGlobalStore("GROUP_PAGES", [] as GroupPage[]);
  const errorStore = useStore({ error: null });

  // fetch tab and group information
  useEffect(async () => {
    const fetchExtensionData = async () => {
      try {
        // tab information
        const tabs = await chrome.tabs.query({});

        // group information
        const tabGroups = await chrome.tabGroups.query({});

        // storage information (includes the notes)
        const { tabGroupInfo: originalTabGroupInfo, ...notes } =
          await chrome.storage.local.get();

        // build an association of the ids to tab group information
        type TabGroupInfo = {
          [groupId: number]: { title: string; color: string };
        };
        const currentTabGroupInfo: TabGroupInfo = {};
        tabGroups.forEach((tabGroup) => {
          currentTabGroupInfo[tabGroup.id] = {
            title: tabGroup.title,
            color: tabGroup.color,
          };
        });

        // check to see if each note has an associated tabGroup
        Object.entries(notes).forEach(([originalGroupId, note]) => {
          // first check if the group id exists (if it does, we are good, the tab group still exists)
          const existingTargetGroup = tabGroups.find(
            (group) => group.id === parseInt(originalGroupId)
          );
          if (existingTargetGroup) {
            console.log(
              `found matching existing group id: ${existingTargetGroup.id}, ${existingTargetGroup.title}, ${existingTargetGroup.color}`
            );
            return;
          }

          const originalGroupInfoForNote =
            originalTabGroupInfo[originalGroupId];

          // if we can't find the tab group info (like title and color) for this note, then it's gone :(
          if (!originalGroupInfoForNote) {
            return;
          }

          // check if there is a group that matches based on the tabGroupInfo
          const [targetTabGroupId, targetTagGroupInfo] = Object.entries(
            currentTabGroupInfo
          ).find(([groupId, groupInfo]) => {
            return (
              groupInfo.title === originalGroupInfoForNote.title &&
              groupInfo.color === originalGroupInfoForNote.color
            );
          });

          // if we found one, then point the note to this tab group
          if (targetTabGroupId) {
            console.log(
              `found matching new group id: ${targetTabGroupId}, ${targetTagGroupInfo.title}, ${targetTagGroupInfo.color}`
            );

            notes[targetTabGroupId] = notes[originalGroupId];
            chrome.storage.local.set({
              [targetTabGroupId]: notes[originalGroupId],
            });
            chrome.storage.local.remove(originalGroupId);
          }
        });

        // save what we know to the local storage
        chrome.storage.local.set({ tabGroupInfo: currentTabGroupInfo });

        return { tabs, tabGroups, notes, error: null };
      } catch (error) {
        return { tabs: [], tabGroups: [], notes: {}, error };
      }
    };
    const {
      tabs,
      tabGroups,
      notes,
      error: extendsionDataError,
    } = await fetchExtensionData();

    if (extendsionDataError) {
      errorStore.error = extendsionDataError;
      return;
    }

    // the ungrouped tabs, shows up first, and aggregates all ungrouped tabs regardless of position
    const ungroupedTabPage: GroupPage = {
      collapsed: false,
      color: "grey",
      id: -1,
      title: undefined,
      windowId: -1,
      tabs: [],
    };

    // populate the groupPages by iterating through the tabs
    // this way they are in the order that they appear in the window
    tabs.forEach((tab) => {
      const lastGroup = groupPages.at(-1);

      // if this is a tab that doesn't belong to a group, add it to the ungroupedTabPage
      if (tab.groupId === -1) {
        ungroupedTabPage.tabs.push(tab);
        return;
      }

      if (lastGroup?.id === tab.groupId) {
        // if the tab is in the last associated group, push this tab on it
        lastGroup.tabs.push(tab);
        return;
      }

      // if we have a new group (or there was no previous one), make a new group page for it
      if (lastGroup === undefined || lastGroup.id !== tab.groupId) {
        // get the group the tab is pointing to (or a new one, if this isn't part of a group)
        const newTabGroup = tabGroups.find(
          (group) => group.id === tab.groupId
        ) as GroupPage;

        newTabGroup.tabs = [tab];
        newTabGroup.notes = notes[newTabGroup.id];
        groupPages.push(newTabGroup);
        return;
      }
    }, []);

    // if we have any ungrouped tabs, push the ungrouped tab group to the groupPages
    if (ungroupedTabPage.tabs?.length > 0) {
      groupPages.push(ungroupedTabPage);
    }
  });

  // load page notes live
  useEffect(async () => {
    const fetchThisTab = async () => {
      try {
        const thisTab = (
          await chrome.tabs.query({ active: true, lastFocusedWindow: true })
        ).at(0);

        return { thisTab, error: null };
      } catch (error) {
        return { thisTab: null, error };
      }
    };

    const { thisTab, error: thisTabError } = await fetchThisTab();
    if (thisTabError) {
      errorStore.error = thisTabError;
    }

    // function to handle new changes we get to the chrome extension local storage
    const updatePageOnChanged = (changes) => {
      // iterate through the changes (chances are we'll only ever get one)
      Object.entries(changes).forEach(
        async ([groupId, change]: [string, any]) => {
          const targetGroup = groupPages.find(
            (page) => page.id === parseInt(groupId)
          );

          // get the current active tab
          const activeTab = await (
            await chrome.tabs.query({ active: true, lastFocusedWindow: true })
          ).at(0);

          // if the active tab and current tab are different, we can update safely
          if (thisTab.id !== activeTab.id) {
            targetGroup.notes = change.newValue;
          }
        }
      );
    };

    // attach a listener for new changes
    chrome.storage.onChanged.addListener(updatePageOnChanged);
  });

  const pages = groupPages.map((group, index) => {
    if (group.collapsed) {
      return html`<collapsed-page index=${index} />`;
    }
    return html`<page index=${index} />`;
  });

  // if we encountered an error, show the error page
  if (errorStore.error) {
    console.error(errorStore.error);
    return html`
      <main>
        <error-page>
          <p>
            An error was caught when trying to pull chrome tab data. <br />
            This is often resolved by quiting and relaunching your browser.
          </p>
          <p>
            <a href="https://github.com/JRJurman/new-tab-group-notes/issues/7">
              If you continue to see issues, please post here.
            </a>
          </p>
        </error-page>
      </main>
    `;
  }

  return html`
    <main class="app">
      <page-scroller> ${pages} </page-scroller>
    </main>
  `;
};

export default app;

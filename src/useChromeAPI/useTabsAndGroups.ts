import { useEffect, useGlobalStore } from "tram-one";
import { GroupPage, TabGroupInfo } from "../types";

const useTabsAndGroups = () => {
  const groupPages = useGlobalStore("GROUP_PAGES", [] as GroupPage[]);
  const errorStore = useGlobalStore("ERROR_STORE", { error: null });

  // fetch tab and group information
  useEffect(async () => {
    const fetchAndUpdate = async () => {
      try {
        // before we do anything, if there was focus on the page,
        // remove it, so we don't refocus blindly
        (document.activeElement as HTMLElement).blur();

        // also get the current scroll position (so we can attempt to go back to it)
        const pageScrollerElement =
          document.querySelector(`.page-scroller-flex`);
        const currentScrollPosition = pageScrollerElement.scrollLeft;

        // tab information
        const tabs = await chrome.tabs.query({});

        // get all the windows (so we know what windows to query for tabGroups)
        const windows = await chrome.windows.getAll({
          windowTypes: ["normal"],
        });

        // group information
        const tabGroups = [];
        windows.forEach(async ({ id: windowId }) => {
          const tabGroupsForWindow = await chrome.tabGroups.query({ windowId });
          tabGroups.push(...tabGroupsForWindow);
        });

        // storage information (includes the notes)
        const { tabGroupInfo: existingTabGroupInfo, ...notes } =
          (await chrome.storage.local.get()) || {};

        // build an association of the ids to tab group information
        const currentTabGroupInfo: TabGroupInfo = {};
        tabGroups.forEach((tabGroup) => {
          currentTabGroupInfo[tabGroup.id] = {
            title: tabGroup.title,
            color: tabGroup.color,
            datetime: new Date().toISOString(),
          };
        });

        // check to see if each note has an associated tabGroup
        Object.entries(notes).forEach(([originalGroupId, note]) => {
          // first check if the group id exists (if it does, we are good, the tab group still exists)
          const existingTargetGroup = tabGroups.find(
            (group) => group.id === parseInt(originalGroupId)
          );
          if (existingTargetGroup) {
            return;
          }

          // pull the details from when the note was last edited (like the color and title)
          const originalGroupInfoForNote =
            existingTabGroupInfo[originalGroupId];

          // if we can't find the tab group info for this note, then we have nothing to match it to
          // it's effectively gone, and we'll have to drop it
          if (!originalGroupInfoForNote) {
            return;
          }

          // if we did find the tab group info, let's see if there's a current one that matches
          const [targetTabGroupId, targetTagGroupInfo] =
            Object.entries(currentTabGroupInfo).find(([groupId, groupInfo]) => {
              return (
                groupInfo.title === originalGroupInfoForNote.title &&
                groupInfo.color === originalGroupInfoForNote.color
              );
            }) || [];

          // if we found one, then point the note to this tab group
          if (targetTabGroupId) {
            notes[targetTabGroupId] = notes[originalGroupId];

            // update the group id this note points to in chrome local storage
            chrome.storage.local.set({
              [targetTabGroupId]: notes[originalGroupId],
            });

            // remove references to the old group id
            chrome.storage.local.remove(originalGroupId);
            delete existingTabGroupInfo[originalGroupId];
          }
        });

        // add what we know about tab groups to the local storage
        const newTabGroupInfo: TabGroupInfo = {
          ...existingTabGroupInfo,
          ...currentTabGroupInfo,
        };

        // if we've reached a high number of saved tab groups,
        // remove anything that is older than 2 weeks
        if (Object.keys(newTabGroupInfo).length > 20) {
          const currentTime = Date.now();
          Object.entries(newTabGroupInfo).forEach(([groupId, { datetime }]) => {
            const groupEntryDateTime = new Date(datetime);
            const isOlderThan2Weeks =
              currentTime - groupEntryDateTime.getTime() >
              1000 * 60 * 60 * 24 * 7 * 2;
            if (isOlderThan2Weeks) {
              delete newTabGroupInfo[groupId];
            }
          });
        }

        chrome.storage.local.set({ tabGroupInfo: newTabGroupInfo });

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
        const newGroupPages = [];
        tabs.forEach((tab) => {
          const lastGroup = newGroupPages.at(-1);

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
            newGroupPages.push(newTabGroup);
            return;
          }
        }, []);

        // if we have any ungrouped tabs, push the ungrouped tab group to the newGroupPages
        if (ungroupedTabPage.tabs?.length > 0) {
          newGroupPages.push(ungroupedTabPage);
        }

        // check if the newGroupPages are actually different from the existing group pages
        // if they are the same, don't worry about updating, we are fine
        const newGroupPagesAreSame =
          JSON.stringify(newGroupPages) === JSON.stringify(groupPages);
        if (newGroupPagesAreSame) {
          console.log("pages were same, skipping update");
          return;
        }

        // clear and set the groupPages to the newGroupPages
        groupPages.splice(0, groupPages.length);
        groupPages.push(...newGroupPages);

        // finally, reset the scroll to what it was before we started,
        const newPageScrollerElement =
          document.querySelector(`.page-scroller-flex`);
        newPageScrollerElement.scrollTo({ left: currentScrollPosition });
      } catch (error) {
        errorStore.error = error;
      }
    };

    // call an initial fetch and update for tabs and groups
    fetchAndUpdate();

    // setup listeners to call when groups change
    chrome.tabGroups.onUpdated.addListener(fetchAndUpdate);
    chrome.tabGroups.onMoved.addListener(fetchAndUpdate);
    chrome.tabGroups.onRemoved.addListener(fetchAndUpdate);
    chrome.tabGroups.onCreated.addListener(fetchAndUpdate);

    // setup listeners to call when individual tabs change
    chrome.tabs.onAttached.addListener(fetchAndUpdate);
    chrome.tabs.onCreated.addListener(fetchAndUpdate);
    chrome.tabs.onDetached.addListener(fetchAndUpdate);
    chrome.tabs.onMoved.addListener(fetchAndUpdate);
    chrome.tabs.onRemoved.addListener(fetchAndUpdate);
  });
};

export default useTabsAndGroups;

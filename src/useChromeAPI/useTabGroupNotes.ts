import { useEffect, useGlobalStore } from "tram-one";
import { GroupPage } from "../types";

const useTabGroupNotes = () => {
  const groupPages = useGlobalStore("GROUP_PAGES", [] as GroupPage[]);
  const errorStore = useGlobalStore("ERROR_STORE", { error: null });

  // load page notes live
  useEffect(async () => {
    try {
      // function to handle new changes we get to the chrome extension local storage
      const updatePageOnChanged = async (changes) => {
        // first, determine what tab is being updated
        const activeTabs = await chrome.tabs.query({
          active: true,
          lastFocusedWindow: true,
        });
        const activeTab = activeTabs.at(0);

        // get this tab (the one running the script)
        const currentTab = await chrome.tabs.getCurrent();

        // if the current is the active tab, don't update it
        // this creates laggy update behavior (and isn't required, the user is already updating it)
        if (currentTab.id === activeTab.id) {
          return;
        }

        // iterate through the changes (chances are we'll only ever get one)
        Object.entries(changes).forEach(
          async ([groupId, change]: [string, any]) => {
            const targetGroup = groupPages.find(
              (page) => page.id === parseInt(groupId)
            );

            // if we couldn't find a target group, perhaps this tab doesn't have the latest groups
            // for now, just ignore, and expect a refresh
            if (!targetGroup) {
              return;
            }

            targetGroup.notes = change.newValue;
          }
        );
      };

      // attach a listener for new changes
      chrome.storage.onChanged.addListener(updatePageOnChanged);
    } catch (error) {
      errorStore.error = error;
    }
  });
};

export default useTabGroupNotes;

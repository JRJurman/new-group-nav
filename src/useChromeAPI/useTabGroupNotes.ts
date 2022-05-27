import { useEffect, useGlobalStore } from "tram-one";
import { GroupPage } from "../app";

const useTabGroupNotes = () => {
  const groupPages = useGlobalStore("GROUP_PAGES", [] as GroupPage[]);
  const errorStore = useGlobalStore("ERROR_STORE", { error: null });

  // load page notes live
  useEffect(async () => {
    try {
      const thisTab = (
        await chrome.tabs.query({ active: true, lastFocusedWindow: true })
      ).at(0);

      // function to handle new changes we get to the chrome extension local storage
      const updatePageOnChanged = (changes) => {
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
    } catch (error) {
      errorStore.error = error;
    }
  });
};

export default useTabGroupNotes;

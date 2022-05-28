import { useGlobalStore } from "tram-one";
import { GroupPage } from "../types";

/**
 * Hook to get the information for a single tab group (or the ungrouped tabs).
 * This is indexed by how they appear in the app, not where the tabs or groups actually are
 * (although we try to make these line up as much as possible).
 */
const useTargetGroupPage: (number) => GroupPage = (index) => {
  const groupPages = useGlobalStore("GROUP_PAGES") as GroupPage[];
  const targetGroupPage = groupPages[index];

  // if targetGroupPage is undefined, we are probably live updating tabs
  // for now just return a bogus GroupPage object
  if (!targetGroupPage) {
    return {
      collapsed: false,
      color: "grey",
      id: -2,
      windowId: -1,
    };
  }

  return targetGroupPage;
};

export default useTargetGroupPage;

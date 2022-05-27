import { useGlobalStore } from "tram-one";
import { GroupPage } from "../types";

/**
 * Hook to get the information for a single tab group (or the ungrouped tabs).
 * This is indexed by how they appear in the app, not where the tabs or groups actually are
 * (although we try to make these line up as much as possible).
 */
const useTargetGroupPage = (index) => {
  const groupPages = useGlobalStore("GROUP_PAGES") as GroupPage[];
  const targetGroupPage = groupPages[index];

  return targetGroupPage;
};

export default useTargetGroupPage;

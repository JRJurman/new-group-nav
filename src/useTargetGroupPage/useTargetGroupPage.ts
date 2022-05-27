import { useGlobalStore } from "tram-one";
import { GroupPage } from "../types";

const useTargetGroupPage = (index) => {
  const groupPages = useGlobalStore("GROUP_PAGES") as GroupPage[];
  const targetGroupPage = groupPages[index];

  return targetGroupPage;
};

export default useTargetGroupPage;

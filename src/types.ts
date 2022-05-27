type TabGroup = chrome.tabGroups.TabGroup;
type Tab = chrome.tabs.Tab;

export interface GroupPage extends TabGroup {
  tabs?: Tab[];
  notes?: string;
  isCollapsing?: boolean;
  isExpanding?: boolean;
}

export type TabGroupInfo = {
  [groupId: number]: { title: string; color: string; datetime: string };
};

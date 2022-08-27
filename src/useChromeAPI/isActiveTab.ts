export const isActiveTab = async () => {
  // first, determine what tab is being updated
  const activeTabs = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  const activeTab = activeTabs.at(0);

  // get this tab (the one running the script)
  const currentTab = await chrome.tabs.getCurrent();

  return currentTab.id === activeTab?.id;
};

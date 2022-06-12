import { useEffect, useGlobalStore } from "tram-one";

/**
 * Hook to get and set the value of the resize control
 */
const useDividerHeight = () => {
  const dragControlStore = useGlobalStore("DRAG_CONTROL", {
    dividerHeight: 0.45,
  });
  const errorStore = useGlobalStore("ERROR_STORE", { error: null });

  const fetchDividerHeight = async () => {
    try {
      const dividerLocalStorage =
        (await chrome.storage.local.get("dividerHeight")) || {};
      if (dividerLocalStorage.dividerHeight) {
        dragControlStore.dividerHeight = dividerLocalStorage.dividerHeight;
      }
    } catch (error) {
      errorStore.error = error;
    }
  };

  useEffect(async () => {
    try {
      await fetchDividerHeight();
      chrome.storage.onChanged.addListener(fetchDividerHeight);
    } catch (error) {
      errorStore.error = error;
    }
  });

  const setDividerHeight = (newHeight: number) => {
    dragControlStore.dividerHeight = newHeight;
    chrome.storage.local.set({
      dividerHeight: newHeight,
    });
  };

  return { setDividerHeight };
};

export default useDividerHeight;

import { registerHtml, TramOneComponent, useEffect, useStore } from "tram-one";
import useTargetGroupPage from "../useTargetGroupPage";
import "./page-notes.css";

const html = registerHtml();

// @ts-expect-error https://github.com/Tram-One/tram-one/issues/193
const pageNotes: TramOneComponent = ({ index }: { index: number }) => {
  const targetGroupPage = useTargetGroupPage(index);
  const dragControlStore = useStore({
    dividerHeight: 0.45,
  });

  useEffect(() => {
    const updateDividerHeight = async () => {
      const dividerLocalStorage =
        (await chrome.storage.local.get("dividerHeight")) || {};
      if (dividerLocalStorage.dividerHeight) {
        dragControlStore.dividerHeight = dividerLocalStorage.dividerHeight;
      }
    };
    chrome.storage.onChanged.addListener(updateDividerHeight);
  });

  const updateNotes = (event) => {
    const updatedNotesValue = event.target.value;
    chrome.storage.local.set({ [targetGroupPage.id]: updatedNotesValue });
  };

  const cursorDragOffset = "40px";

  const notesHeight = `calc(${
    (1 - dragControlStore.dividerHeight) * 100
  }vh - ${cursorDragOffset})`;

  return html`
    <textarea
      class="page-notes note-${index}"
      oninput=${updateNotes}
      placeholder="Jot notes here for your tab group!"
      style="height: ${notesHeight}"
    >
      ${targetGroupPage.notes}
    </textarea
    >
  `;
};

export default pageNotes;

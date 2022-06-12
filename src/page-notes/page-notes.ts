import { registerHtml, TramOneComponent, useGlobalStore } from "tram-one";
import useTargetGroupPage from "../useTargetGroupPage";
import "./page-notes.css";

const html = registerHtml();

const pageNotes: TramOneComponent<{ index: number }> = ({ index }) => {
  const targetGroupPage = useTargetGroupPage(index);
  const dragControlStore = useGlobalStore("DRAG_CONTROL", {
    dividerHeight: 0.45,
  });

  const updateNotes = (event) => {
    const updatedNotesValue = event.target.value;
    chrome.storage.local.set({ [targetGroupPage.id]: updatedNotesValue });
  };

  const cursorDragOffset = "25px";

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

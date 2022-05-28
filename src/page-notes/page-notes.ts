import { registerHtml, TramOneComponent } from "tram-one";
import useTargetGroupPage from "../useTargetGroupPage";
import "./page-notes.css";

const html = registerHtml();

// @ts-expect-error https://github.com/Tram-One/tram-one/issues/193
const pageNotes: TramOneComponent = ({ index }: { index: number }) => {
  const targetGroupPage = useTargetGroupPage(index);

  const updateNotes = (event) => {
    const updatedNotesValue = event.target.value;
    chrome.storage.local.set({ [targetGroupPage.id]: updatedNotesValue });
  };

  return html`
    <textarea
      class="page-notes note-${index}"
      oninput=${updateNotes}
      placeholder="Jot notes here for your tab group!"
    >
      ${targetGroupPage.notes}
    </textarea
    >
  `;
};

export default pageNotes;

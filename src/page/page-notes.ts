import { registerHtml, TramOneComponent, useGlobalStore } from "tram-one";
import "./page.css";

const html = registerHtml();

// @ts-expect-error https://github.com/Tram-One/tram-one/issues/193
const pageNotes: TramOneComponent = ({ index }: { index: number }) => {
  const pageGroups = useGlobalStore("PAGE_GROUPS");
  const targetPageGroup = pageGroups[index];

  const updateNotes = (event) => {
    const updatedNotesValue = event.target.value;
    chrome.storage.local.set({ [targetPageGroup.id]: updatedNotesValue });
  };

  return html`
    <textarea class="page-notes" oninput=${updateNotes}>
      ${targetPageGroup.notes}
    </textarea
    >
  `;
};

export default pageNotes;

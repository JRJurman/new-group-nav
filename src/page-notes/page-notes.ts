import { registerHtml, TramOneComponent, useGlobalStore } from "tram-one";

const html = registerHtml();

// @ts-expect-error https://github.com/Tram-One/tram-one/issues/193
const pageNotes: TramOneComponent = ({ index }: { index: number }) => {
  const groupPages = useGlobalStore("GROUP_PAGES");
  const targetGroupPage = groupPages[index];

  const updateNotes = (event) => {
    const updatedNotesValue = event.target.value;
    chrome.storage.local.set({ [targetGroupPage.id]: updatedNotesValue });
  };

  return html`
    <textarea
      class="page-notes"
      oninput=${updateNotes}
      placeholder="Jot notes here for your tab group!"
    >
      ${targetGroupPage.notes}
    </textarea
    >
  `;
};

export default pageNotes;

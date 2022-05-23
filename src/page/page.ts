import { registerHtml, TramOneComponent } from "tram-one";
import { collapseIcon } from "../icons";
import tabLink from "../tab-link";
import { PageGroup } from "../app";
import "./page.css";

const html = registerHtml({
  "tab-link": tabLink,
});

type pageProps = {
  groupInfo: PageGroup;
};

// @ts-expect-error https://github.com/Tram-One/tram-one/issues/193
const page: TramOneComponent = ({ groupInfo }: pageProps) => {
  const tabLinks = groupInfo.tabs.map(
    (tab) =>
      html`<tab-link
        index=${tab.index}
        favicon=${tab.favIconUrl}
        title=${tab.title}
      />`
  );

  const collapseTab = () => {
    groupInfo.collapsed = true;
  };

  const setNotes = (event) => {
    const updatedNotes = event.target.value;
    chrome.storage.local.set({ [groupInfo.id]: updatedNotes });
  };

  const isUngrouped = groupInfo.title === undefined;

  return html`
    <section class="page" page-color=${groupInfo.color}>
      <h1>
        <span>${isUngrouped ? "Ungrouped" : groupInfo.title}</span>
        <span onclick=${collapseTab}>${collapseIcon()}</span>
      </h1>
      <ul>
        ${tabLinks}
      </ul>
      <textarea placeholder="Jot notes here..." oninput=${setNotes}>
 ${groupInfo.notes} </textarea
      >
    </section>
  `;
};

export default page;

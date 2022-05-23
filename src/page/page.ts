import { registerHtml, TramOneComponent, useGlobalStore } from "tram-one";
import { collapseIcon } from "../icons";
import tabLink from "../tab-link";
import { GroupPage } from "../app";
import pageNotes from "./page-notes";
import "./page.css";

const html = registerHtml({
  "tab-link": tabLink,
  "page-notes": pageNotes,
});

// @ts-expect-error https://github.com/Tram-One/tram-one/issues/193
const page: TramOneComponent = ({ index }: { index: number }) => {
  const groupPages = useGlobalStore("GROUP_PAGES") as GroupPage[];
  const targetGroupPage = groupPages[index];

  const tabLinks = targetGroupPage.tabs.map(
    (tab) =>
      html`<tab-link
        index=${tab.index}
        favicon=${tab.favIconUrl}
        title=${tab.title}
      />`
  );

  const collapseTab = () => {
    targetGroupPage.collapsed = true;
  };

  const isUngrouped = targetGroupPage.title === undefined;

  return html`
    <section class="page" page-color=${targetGroupPage.color}>
      <h1>
        <span>${isUngrouped ? "Ungrouped" : targetGroupPage.title}</span>
        <span onclick=${collapseTab}>${collapseIcon()}</span>
      </h1>
      <ul>
        ${tabLinks}
      </ul>
      <page-notes index=${index} />
    </section>
  `;
};

export default page;

import { registerHtml, TramOneComponent, useGlobalStore } from "tram-one";
import { GroupPage } from "../app";
import { expandIcon } from "../icons";
import "./page.css";

const html = registerHtml();

// @ts-expect-error https://github.com/Tram-One/tram-one/issues/193
const collapsedPage: TramOneComponent = ({ index }: { index: number }) => {
  const groupPages = useGlobalStore("GROUP_PAGES") as GroupPage[];
  const targetGroupPage = groupPages[index];

  const expandTab = () => {
    targetGroupPage.collapsed = false;
  };

  const isUngrouped = !targetGroupPage.title;
  const ungroupedClass = isUngrouped ? "ungrouped" : "";
  const tabTitles = targetGroupPage.tabs.map((tab) => tab.title).join(", ");
  return html`
    <section class="collapsed-page " page-color=${targetGroupPage.color}>
      <span onclick=${expandTab}>${expandIcon()}</span>

      <h1 class="${ungroupedClass}">${targetGroupPage.title || tabTitles}</h1>
    </section>
  `;
};

export default collapsedPage;

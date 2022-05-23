import { registerHtml, TramOneComponent } from "tram-one";
import { PageGroup } from "../app";
import { expandIcon } from "../icons";
import "./page.css";

const html = registerHtml();

type pageProps = {
  groupInfo: PageGroup;
};

// @ts-expect-error https://github.com/Tram-One/tram-one/issues/193
const collapsedPage: TramOneComponent = ({ groupInfo }: pageProps) => {
  const expandTab = () => {
    groupInfo.collapsed = false;
  };

  const isUngrouped = !groupInfo.title;
  const ungroupedClass = isUngrouped ? "ungrouped" : "";
  const tabTitles = groupInfo.tabs.map((tab) => tab.title).join(", ");
  return html`
    <section class="collapsed-page " page-color=${groupInfo.color}>
      <span onclick=${expandTab}>${expandIcon()}</span>

      <h1 class="${ungroupedClass}">${groupInfo.title || tabTitles}</h1>
    </section>
  `;
};

export default collapsedPage;

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

  return html`
    <section class="page" page-color=${groupInfo.color}>
      <h1>
        <span>${groupInfo.title || "Ungrouped"}</span>
        <span onclick=${collapseTab}>${collapseIcon()}</span>
      </h1>
      <ul>
        ${tabLinks}
      </ul>
      <textarea placeholder="Types Notes Here"></textarea>
    </section>
  `;
};

export default page;

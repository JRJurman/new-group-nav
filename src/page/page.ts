import { registerHtml, TramOneComponent, useGlobalStore } from "tram-one";
import tabLink from "../tab-link";
import { PageGroup } from "../app/app";
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

  return html`
    <section class="page" style="background: ${groupInfo.color}">
      <h1>${groupInfo.title || "Ungrouped"}</h1>
      <ul>
        ${tabLinks}
      </ul>
      <textarea></textarea>
    </section>
  `;
};

export default page;

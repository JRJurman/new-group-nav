import { registerHtml, TramOneComponent, useGlobalStore } from "tram-one";
import tabLink from "../tab-link";
import "./page.css";

const html = registerHtml({
  "tab-link": tabLink,
});

type TabGroup = chrome.tabGroups.TabGroup;
type Tab = chrome.tabs.Tab;

type pageProps = {
  groupInfo: TabGroup;
};

// @ts-expect-error https://github.com/Tram-One/tram-one/issues/193
const page: TramOneComponent = ({ groupInfo }: pageProps) => {
  const tabStore = useGlobalStore("TAB_STORE") as Tab[];

  const tabsForGroup = tabStore.filter((tab) => tab.groupId === groupInfo.id);
  const tabLinks = tabsForGroup.map(
    (tab) => html`<tab-link favicon=${tab.favIconUrl} title=${tab.title} />`
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

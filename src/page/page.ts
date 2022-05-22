import { registerHtml, TramOneComponent, useGlobalStore } from "tram-one";
import "./page.css";

const html = registerHtml();

type TabGroup = chrome.tabGroups.TabGroup;
type Tab = chrome.tabs.Tab;

type pageProps = {
  groupInfo: TabGroup;
};

// @ts-expect-error https://github.com/Tram-One/tram-one/issues/193
const page: TramOneComponent = ({ groupInfo }: pageProps) => {
  const tabStore = useGlobalStore("TAB_STORE") as Tab[];

  const tabsForGroup = tabStore.filter((tab) => tab.groupId === groupInfo.id);
  const urls = tabsForGroup.map((tab) => html`<li>${tab.url}</li>`);

  return html`
    <section class="page" style="background: ${groupInfo.color}">
      <h1>${groupInfo.title || "Ungrouped"}</h1>
      <h2>Tabs:</h2>
      <ul>
        ${urls}
      </ul>
      <h2>Notes</h2>
      <textarea></textarea>
    </section>
  `;
};

export default page;

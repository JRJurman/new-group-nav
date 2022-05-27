import { registerHtml, TramOneComponent, useGlobalStore } from "tram-one";
import pageScroller from "../page-scroller";
import errorPage from "../error-page";
import "./app.css";
import { useTabGroupNotes, useTabsAndGroups } from "../useChromeAPI";

const html = registerHtml({
  "page-scroller": pageScroller,
  "error-page": errorPage,
});

type TabGroup = chrome.tabGroups.TabGroup;
type Tab = chrome.tabs.Tab;

export interface GroupPage extends TabGroup {
  tabs?: Tab[];
  notes?: string;
  isCollapsing?: boolean;
  isExpanding?: boolean;
}

const app: TramOneComponent = () => {
  const errorStore = useGlobalStore("ERROR_STORE", { error: null });

  // fetch tabs, groups, and tab-group notes!
  useTabsAndGroups();
  useTabGroupNotes();

  // if we encountered an error, show the error page
  if (errorStore.error) {
    return html`
      <main>
        <error-page />
      </main>
    `;
  }

  return html`
    <main class="app">
      <page-scroller />
    </main>
  `;
};

export default app;

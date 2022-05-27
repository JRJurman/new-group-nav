import { registerHtml, TramOneComponent, useGlobalStore } from "tram-one";
import pageScroller from "../page-scroller";
import errorPage from "../error-page";
import "./app.css";
import { useTabGroupNotes, useTabsAndGroups } from "../useChromeAPI";

const html = registerHtml({
  "page-scroller": pageScroller,
  "error-page": errorPage,
});

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

  // if we didn't encounter an error, show the app, with the pages!
  return html`
    <main class="app">
      <page-scroller />
    </main>
  `;
};

export default app;

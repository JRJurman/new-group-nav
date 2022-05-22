import { registerHtml, TramOneComponent } from "tram-one";
import noteSelector from "../note-selector";
import pageScroller from "../page-scroller";
import page from "../page";
import "./app.css";

const html = registerHtml({
  "note-selector": noteSelector,
  "page-scroller": pageScroller,
  page: page,
});

const app: TramOneComponent = () => {
  return html`
    <main class="app">
      <page-scroller>
        <page />
        <page />
        <page />
        <page />
        <page />
        <page />
        <page />
        <page />
        <page />
        <page />
      </page-scroller>
    </main>
  `;
};

export default app;

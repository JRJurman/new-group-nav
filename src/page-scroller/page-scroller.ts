import { registerHtml, TramOneComponent, useGlobalStore } from "tram-one";
import { GroupPage } from "../types";
import page, { blankPage } from "../page";
import "./page-scroller.css";

const html = registerHtml({
  page: page,
  "blank-page": blankPage,
});

const pageScroller: TramOneComponent = (props, children) => {
  const groupPages = useGlobalStore("GROUP_PAGES") as GroupPage[];

  const pages = groupPages.map((group, index) => {
    return html`<page index=${index} />`;
  });

  return html` <section class="page-scroller">
    <section class="page-scroller-flex">${pages} <blank-page /></section>
  </section>`;
};

export default pageScroller;

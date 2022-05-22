import { registerHtml, TramOneComponent } from "tram-one";
import "./page-scroller.css";

const html = registerHtml();

const pageScroller: TramOneComponent = (props, children) => {
  return html` <section class="page-scroller">
    <section class="page-scroller-flex">${children}</section>
  </section>`;
};

export default pageScroller;

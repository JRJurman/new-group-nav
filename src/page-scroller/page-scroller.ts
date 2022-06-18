import {
  registerHtml,
  TramOneComponent,
  useEffect,
  useGlobalStore,
} from "tram-one";
import { GroupPage } from "../types";
import page, { blankPage, iframePage } from "../page";
import "./page-scroller.css";

const html = registerHtml({
  page: page,
  "blank-page": blankPage,
  "iframe-page": iframePage,
});

const pageScroller: TramOneComponent = (props, children) => {
  const groupPages = useGlobalStore("GROUP_PAGES") as GroupPage[];

  const scrollToPage = () => {
    // get the page-scroller-flex (this is the element which actually scrolls)
    const pageScrollerElement = document.querySelector(`.page-scroller-flex`);

    // get the current scroll position (we'll go back here later before moving)
    const currentScrollPosition = pageScrollerElement.scrollLeft;

    // determine what page was given focus
    const focusedPage = document.querySelector(
      ".page:focus-within"
    ) as HTMLElement;

    // put all the elements at their original offset
    pageScrollerElement.scrollLeft = 0;

    // get the location of the page now
    const pageOffset = focusedPage.offsetLeft;

    // we don't need the page to be right along the left side
    const pagePreOffset = window.innerWidth / 4;

    // build the new position to scroll to based on the where the page is, and the preoffset
    const newScrollPosition = pageOffset - pagePreOffset;

    // check if the user has preferred reduced motion (in that case we won't do a smooth transiiton)
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // reset the scroll to what it was before we started,
    // and then smooth transition to the new location
    pageScrollerElement.scrollTo({ left: currentScrollPosition });
    pageScrollerElement.scrollTo({
      left: newScrollPosition,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  useEffect(() => {
    // really this is just to make sure we call the useEffect on re-render
    // see https://github.com/Tram-One/tram-one/issues/130
    if (groupPages.length) {
      // for some reason, it's not possible to set onfocusin direclty with JS
      // this is documented in w3schools
      const pageScrollerElement = document.querySelector(`.page-scroller`);
      pageScrollerElement.addEventListener("focusin", scrollToPage);
    }
  });

  const pages = groupPages.map((group, index) => {
    return html`<page index=${index} />`;
  });

  return html` <section class="page-scroller">
    <section class="page-scroller-flex">
      ${pages}
      <iframe-page />
      <blank-page />
    </section>
  </section>`;
};

export default pageScroller;

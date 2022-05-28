import {
  registerHtml,
  TramOneComponent,
  useEffect,
  useGlobalStore,
} from "tram-one";
import { GroupPage } from "../types";
import page, { blankPage } from "../page";
import "./page-scroller.css";

const html = registerHtml({
  page: page,
  "blank-page": blankPage,
});

const pageScroller: TramOneComponent = (props, children) => {
  const groupPages = useGlobalStore("GROUP_PAGES") as GroupPage[];

  const scrollToPage = () => {
    const pageScrollerElement = document.querySelector(`.page-scroller-flex`);

    const focusedPage = document.querySelector(
      ".page:focus-within"
    ) as HTMLElement;

    // check if element with focus is also currently being hovered
    const focusedHoveredElement = document.querySelector(":focus:hover");
    if (focusedHoveredElement) {
      // if the element is both hovered and focused, check what kind of element it is
      // in some cases we want to skip scrolling, since that would mess with the click event
      if (focusedHoveredElement.matches("a, button")) {
        return;
      }
    }

    // get the current scroll position (we'll go back here later before moving)
    const currentScrollPosition = pageScrollerElement.scrollLeft;

    // put all the elements at their original offset
    pageScrollerElement.scrollLeft = 0;
    // get the location of the page now
    const pageOffset = focusedPage.offsetLeft;

    // we don't need the page to be right along the left side
    const pagePreOffset = window.innerWidth / 2;

    // check if the user has preferred reduced motion (in that case we won't do a smooth transiiton)
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // reset the scroll to what it was before we started,
    // and then smooth transition to the new location
    pageScrollerElement.scrollTo({ left: currentScrollPosition });
    pageScrollerElement.scrollTo({
      left: pageOffset - pagePreOffset,
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
    <section class="page-scroller-flex">${pages} <blank-page /></section>
  </section>`;
};

export default pageScroller;

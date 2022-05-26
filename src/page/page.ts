import {
  registerHtml,
  TramOneComponent,
  useEffect,
  useGlobalStore,
} from "tram-one";
import { collapseIcon } from "../icons";
import tabLink from "../tab-link";
import { GroupPage } from "../app";
import pageNotes from "./page-notes";
import "./page.css";
import "./page-colors.css";
import "./page-animations.css";

const html = registerHtml({
  "tab-link": tabLink,
  "page-notes": pageNotes,
});

// @ts-expect-error https://github.com/Tram-One/tram-one/issues/193
const page: TramOneComponent = ({ index }: { index: number }) => {
  const groupPages = useGlobalStore("GROUP_PAGES") as GroupPage[];
  const targetGroupPage = groupPages[index];

  // clear animation styles
  useEffect(() => {
    setTimeout(() => {
      // if we were expanding or collapsing, clear that
      targetGroupPage.isExpanding = false;
      targetGroupPage.isCollapsing = false;
    }, 800);
  });

  const tabLinks = targetGroupPage.tabs.map(
    (tab) =>
      html`<tab-link
        index=${tab.index}
        windowId=${tab.windowId}
        favicon=${tab.favIconUrl}
        title=${tab.title}
      />`
  );

  const collapseTab = () => {
    // if user prefers reduced motion, just collapse the tab
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targetGroupPage.collapsed = true;
      return;
    }

    // if the user is okay with motion, let's animate and then collapse
    targetGroupPage.isCollapsing = true;
    setTimeout(() => {
      targetGroupPage.collapsed = true;
    }, 600);
  };

  const isUngrouped = targetGroupPage.title === undefined;

  // for now, ungrouped tabs can not be collapsed
  // this causes a bunch of visual issues when animated, and isn't totally worth working around
  // in the future we may enable this, but for now, it is the only uncollapsable group
  const isCollapsable = !isUngrouped;
  const collapseControl = isCollapsable
    ? html`<button onclick=${collapseTab}>${collapseIcon()}</button>`
    : "";

  const animationClassNames = `${
    targetGroupPage.isCollapsing || targetGroupPage.isExpanding
      ? "animating"
      : ""
  } ${targetGroupPage.isCollapsing ? "collapsing" : ""} ${
    targetGroupPage.isExpanding ? "expanding" : ""
  }`;

  return html`
    <section
      class="page ${animationClassNames}"
      page-color=${targetGroupPage.color}
    >
      <h1>
        <span>${isUngrouped ? "Ungrouped" : targetGroupPage.title}</span>
        ${collapseControl}
      </h1>
      <ul>
        ${tabLinks}
      </ul>
      <page-notes index=${index} />
    </section>
  `;
};

export default page;

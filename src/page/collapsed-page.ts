import {
  registerHtml,
  TramOneComponent,
  useEffect,
  useGlobalStore,
} from "tram-one";
import { GroupPage } from "../app";
import { expandIcon } from "../icons";
import "./collapsed-page.css";
import "./page-colors.css";
import "./page-animations.css";

const html = registerHtml();

// @ts-expect-error https://github.com/Tram-One/tram-one/issues/193
const collapsedPage: TramOneComponent = ({ index }: { index: number }) => {
  const groupPages = useGlobalStore("GROUP_PAGES") as GroupPage[];
  const targetGroupPage = groupPages[index];

  // clear animation styles
  useEffect(() => {
    setTimeout(() => {
      // if we were expanding or collapsing, clear that
      targetGroupPage.isExpanding = false;
      targetGroupPage.isCollapsing = false;
    }, 1000);
  });

  const expandTab = () => {
    // if user prefers reduced motion, just expand the tab
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targetGroupPage.collapsed = false;
      return;
    }

    // if the user is okay with motion, let's animate and then collapse
    targetGroupPage.isExpanding = true;
    setTimeout(() => {
      targetGroupPage.collapsed = false;
    }, 500);
  };

  const animationClassNames = `${
    targetGroupPage.isCollapsing || targetGroupPage.isExpanding
      ? "animating"
      : ""
  } ${targetGroupPage.isCollapsing ? "collapsing" : ""} ${
    targetGroupPage.isExpanding ? "expanding" : ""
  }`;

  const isUngrouped = !targetGroupPage.title;
  const ungroupedClass = isUngrouped ? "ungrouped" : "";
  const tabTitles = targetGroupPage.tabs.map((tab) => tab.title).join(", ");
  return html`
    <section
      class="collapsed-page ${animationClassNames}"
      page-color=${targetGroupPage.color}
    >
      <button onclick=${expandTab}>${expandIcon()}</button>

      <h1 class="${ungroupedClass}">${targetGroupPage.title || tabTitles}</h1>
    </section>
  `;
};

export default collapsedPage;

import { registerHtml, TramOneComponent, useGlobalStore } from "tram-one";
import { GroupPage } from "../types";
import pageTabs from "../page-tabs";
import pageNotes from "../page-notes";
import pageHeader from "../page-header";
import "./expanded-page.css";
import "./collapsed-page.css";
import "./page-animations.css";
import "./page-colors.css";

const html = registerHtml({
  "page-tabs": pageTabs,
  "page-notes": pageNotes,
  "page-header": pageHeader,
});

// @ts-expect-error https://github.com/Tram-One/tram-one/issues/193
const pageController: TramOneComponent = ({ index }: { index: number }) => {
  const groupPages = useGlobalStore("GROUP_PAGES") as GroupPage[];
  const targetGroupPage = groupPages[index];

  const animationClassNames = [
    targetGroupPage.isCollapsing || targetGroupPage.isExpanding
      ? "animating"
      : "",
    targetGroupPage.isCollapsing ? "collapsing" : "",
    targetGroupPage.isExpanding ? "expanding" : "",
  ].join(" ");

  if (targetGroupPage.collapsed) {
    return html`
      <section
        class="page collapsed ${animationClassNames}"
        page-color=${targetGroupPage.color}
      >
        <page-header index=${index} />
      </section>
    `;
  }

  return html`
    <section
      class="page expanded ${animationClassNames}"
      page-color=${targetGroupPage.color}
    >
      <page-header index=${index} />
      <page-tabs index=${index} />
      <page-notes index=${index} />
    </section>
  `;
};

export default pageController;

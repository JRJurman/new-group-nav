import { registerHtml, TramOneComponent } from "tram-one";
import pageTabs from "../page-tabs";
import pageNotes from "../page-notes";
import pageHeader from "../page-header";
import pageDragControl from "../page-drag-control";
import useTargetGroupPage from "../useTargetGroupPage";
import "./expanded-page.css";
import "./collapsed-page.css";
import "./page-animations.css";
import "./page-colors.css";

const html = registerHtml({
  "page-tabs": pageTabs,
  "page-notes": pageNotes,
  "page-header": pageHeader,
  "page-drag-control": pageDragControl,
});

const page: TramOneComponent<{ index: number }> = ({ index }) => {
  const targetGroupPage = useTargetGroupPage(index);

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
        class="page page-${index} collapsed ${animationClassNames}"
        page-color=${targetGroupPage.color}
      >
        <page-header index=${index} />
      </section>
    `;
  }

  return html`
    <section
      class="page page-${index} expanded ${animationClassNames}"
      page-color=${targetGroupPage.color}
    >
      <page-header index=${index} />
      <page-tabs index=${index} />
      <page-drag-control />
      <page-notes index=${index} />
    </section>
  `;
};

export default page;

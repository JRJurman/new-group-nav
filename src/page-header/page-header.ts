import { registerHtml, TramOneComponent } from "tram-one";
import { expandIcon, collapseIcon } from "../icons";
import useTargetGroupPage from "../useTargetGroupPage";
import "./page-header.css";

const html = registerHtml();

type pageHeaderProps = {
  index: number;
};

// @ts-expect-error https://github.com/Tram-One/tram-one/issues/193
const pageHeader: TramOneComponent = ({ index }: pageHeaderProps) => {
  const targetGroupPage = useTargetGroupPage(index);

  const focusOnNotes = () => {
    const relatedNotes = document.querySelector(
      `.note-${index}`
    ) as HTMLTextAreaElement;
    relatedNotes.focus();
  };

  const collapseTab = async () => {
    // first load the latest version of the note
    // otherwise during collapsing we reset to the initial version of the note
    const updatedNotes = ((await chrome.storage.local.get(
      `${targetGroupPage.id}`
    )) || {})[`${targetGroupPage.id}`];
    if (updatedNotes) {
      targetGroupPage.notes = updatedNotes;
    }

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

    // eventually clear the fact that we were animating (once it completes)
    setTimeout(() => {
      targetGroupPage.isCollapsing = false;
    }, 1000);
  };

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
    }, 300);

    // eventually clear the fact that we were animating (once it completes)
    setTimeout(() => {
      targetGroupPage.isExpanding = false;
    }, 1000);
  };

  if (targetGroupPage.collapsed) {
    return html`
      <h1 class="page-header">
        <button aria-label="expand" onclick=${expandTab}>
          ${expandIcon()}
        </button>
        <span>${targetGroupPage.title || "Ungrouped"}</span>
      </h1>
    `;
  }

  return html`
    <h1 class="page-header">
      <span>${targetGroupPage.title || "Ungrouped"}</span>
      <button onclick=${focusOnNotes} class="skip-to-content">
        Skip to notes
      </button>
      <button aria-label="collapse" onclick=${collapseTab}>
        ${collapseIcon()}
      </button>
    </h1>
  `;
};

export default pageHeader;

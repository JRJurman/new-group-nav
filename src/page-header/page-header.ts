import { registerHtml, TramOneComponent, useGlobalStore } from "tram-one";
import { GroupPage } from "../app";
import { expandIcon, collapseIcon } from "../icons";
import "./page-header.css";

const html = registerHtml();

type pageHeaderProps = {
  index: number;
};

// @ts-expect-error https://github.com/Tram-One/tram-one/issues/193
const pageHeader: TramOneComponent = ({ index }: pageHeaderProps) => {
  const groupPages = useGlobalStore("GROUP_PAGES") as GroupPage[];
  const targetGroupPage = groupPages[index];

  /* actions */
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
      <button aria-label="collapse" onclick=${collapseTab}>
        ${collapseIcon()}
      </button>
    </h1>
  `;
};

export default pageHeader;
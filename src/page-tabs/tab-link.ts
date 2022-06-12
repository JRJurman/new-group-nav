import { registerHtml, TramOneComponent } from "tram-one";
import "./tab-link.css";

const html = registerHtml();

type tabLinkProps = {
  index: string;
  favicon?: string;
  title: string;
  windowId: string;
};

const tabLink: TramOneComponent<tabLinkProps> = ({
  index,
  favicon,
  title,
  windowId,
}) => {
  const switchToTab = () => {
    chrome.tabs.highlight({
      tabs: parseInt(index),
      windowId: parseInt(windowId),
    });
    chrome.windows.update(parseInt(windowId), { focused: true });
  };

  // function to prevent focusin event (which causes scrolling)
  const preventFocusPropigation = (event: Event) => {
    event.preventDefault();
  };

  return html`<li class="tab-link">
    <button
      type="button"
      onmousedown=${preventFocusPropigation}
      onclick=${switchToTab}
      alt="Switch to tab - ${title}"
    >
      <img aria-label="favicon" alt="" src=${favicon} />
      <span>${title}</span>
    </button>
  </li> `;
};

export default tabLink;

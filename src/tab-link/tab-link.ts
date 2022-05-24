import { registerHtml, TramOneComponent } from "tram-one";
import "./tab-link.css";

const html = registerHtml();

type tabLinkProps = {
  index: string;
  favicon?: string;
  title: string;
  windowId: string;
};

// @ts-expect-error https://github.com/Tram-One/tram-one/issues/193
const tabLink: TramOneComponent = ({
  index,
  favicon,
  title,
  windowId,
}: tabLinkProps) => {
  const switchToTab = () => {
    chrome.tabs.highlight({
      tabs: parseInt(index),
      windowId: parseInt(windowId),
    });
    chrome.windows.update(parseInt(windowId), { focused: true });
  };
  return html`<li class="tab-link">
    <a href="#" onclick=${switchToTab}><img src=${favicon} />${title}</a>
  </li> `;
};

export default tabLink;

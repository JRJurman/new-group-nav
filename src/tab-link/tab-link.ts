import { registerHtml, TramOneComponent } from "tram-one";
import "./tab-link.css";

const html = registerHtml();

type tabLinkProps = {
  favicon?: string;
  title: string;
};

// @ts-expect-error https://github.com/Tram-One/tram-one/issues/193
const tabLink: TramOneComponent = ({ favicon, title }: tabLinkProps) => {
  return html`<li class="tab-link">
    <img src=${favicon} /><span>${title}</span>
  </li> `;
};

export default tabLink;

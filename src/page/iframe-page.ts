import { registerHtml, TramOneComponent } from "tram-one";
import "./iframe-page.css";

const html = registerHtml();

const iframePage: TramOneComponent = () => {
  return html`
    <section class="iframe-page">
      <iframe
        width="100%"
        height="100%"
        src=${
          // chrome-extension pointing to Tabby Cat, would love if we could get this to work
          // but just get a "This page has been blocked by chrome"
          // "chrome-extension://mefhakmgclhhfbdadeojlkbllmecialg/public/index.html"
          //
          // however, the following webpage does work,
          "https://tram-one.io"
        }
      />
    </section>
  `;
};

export default iframePage;

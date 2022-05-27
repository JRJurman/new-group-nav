import { registerHtml, TramOneComponent, useGlobalStore } from "tram-one";
import "./error-page.css";

const html = registerHtml();

const errorPage: TramOneComponent = () => {
  const errorStore = useGlobalStore("ERROR_STORE") as { error: ErrorEvent };
  return html`
    <section class="error-page">
      <h1>Oh no, an error!</h1>
      <p>An error was caught when trying to pull chrome tab data.</p>
      <p>
        <a href="https://github.com/JRJurman/new-group-nav/issues/7">
          If you are seeing this issue, please post here!
        </a>
      </p>
      <textarea disabled aria-label="error-information">
        ${errorStore.error}
      </textarea
      >
    </section>
  `;
};

export default errorPage;

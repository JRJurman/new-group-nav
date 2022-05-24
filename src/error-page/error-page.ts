import { registerHtml, TramOneComponent } from "tram-one";
import "./error-page.css";

const html = registerHtml();

const errorPage: TramOneComponent = (props, children) => {
  return html`
    <section class="error-page">
      <h1>Oh no! An error happened!</h1>
      ${children}
    </section>
  `;
};

export default errorPage;

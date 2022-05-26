import { registerHtml, TramOneComponent } from "tram-one";
import "./blank-page.css";

const html = registerHtml();

const blankPage: TramOneComponent = () => {
  return html` <section class="blank-page" /> `;
};

export default blankPage;

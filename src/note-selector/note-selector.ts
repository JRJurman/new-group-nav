import { registerHtml, TramOneComponent } from "tram-one";
import "./note-selector.css";

const html = registerHtml();

const noteSelector: TramOneComponent = () => {
  return html` <section class="note-selector">Note Selector</section> `;
};

export default noteSelector;

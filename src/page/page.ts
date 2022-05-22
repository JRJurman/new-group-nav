import { registerHtml, TramOneComponent } from "tram-one";
import "./page.css";

const html = registerHtml();

const page: TramOneComponent = () => {
  return html`
    <section class="page">
      Tabs:
      <textarea></textarea>
      <p width="500px">
        Page Filled with content, lots of content, potentially images? Eh,
        images are hard, really we just want links, I mean, images would be
        awesome, but being able to save a set of tabs would also be good - at
        least, a good starting place...
      </p>
    </section>
  `;
};

export default page;

import { registerHtml, TramOneComponent } from "tram-one";
import "./page.css";

const html = registerHtml();

const page: TramOneComponent = () => {
  return html`
    <section class="page">
      <h1>Tab Group Name</h1>
      <h2>Tabs:</h2>
      <ul>
        <li>https://google.com</li>
        <li>https://google.com</li>
        <li>https://google.com</li>
        <li>https://google.com</li>
      </ul>
      <h2>Notes</h2>
      <textarea></textarea>
    </section>
  `;
};

export default page;

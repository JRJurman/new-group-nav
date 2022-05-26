import {
  registerHtml,
  TramOneComponent,
  useGlobalStore,
  useEffect,
} from "tram-one";
import { GroupPage } from "../app";
import page from "./page";
import collapsedPage from "./collapsed-page";

const html = registerHtml({
  page: page,
  "collapsed-page": collapsedPage,
});

// @ts-expect-error https://github.com/Tram-One/tram-one/issues/193
const pageController: TramOneComponent = ({ index }: { index: number }) => {
  const groupPages = useGlobalStore("GROUP_PAGES") as GroupPage[];
  const targetGroupPage = groupPages[index];

  useEffect(() => {
    setTimeout(() => {
      // if we were expanding or collapsing, clear that
      targetGroupPage.isExpanding = false;
      targetGroupPage.isCollapsing = false;
    }, 800);
  });

  const pageToRender = targetGroupPage.collapsed
    ? html`<collapsed-page index=${index} />`
    : html`<page index=${index} />`;

  return html` <section class="page-controller">${pageToRender}</section> `;
};

export default pageController;

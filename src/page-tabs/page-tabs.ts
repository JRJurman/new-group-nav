import { registerHtml, TramOneComponent, useGlobalStore } from "tram-one";
import { GroupPage } from "../types";
import tabLink from "./tab-link";

const html = registerHtml({
  "tab-link": tabLink,
});

type pageTabsProps = {
  index: string;
};

// @ts-expect-error https://github.com/Tram-One/tram-one/issues/193
const pageTabs: TramOneComponent = ({ index }: pageTabsProps) => {
  const groupPages = useGlobalStore("GROUP_PAGES") as GroupPage[];
  const targetGroupPage = groupPages[index];

  const tabLinks = targetGroupPage.tabs.map(
    (tab) =>
      html`<tab-link
        index=${tab.index}
        windowId=${tab.windowId}
        favicon=${tab.favIconUrl}
        title=${tab.title}
      />`
  );

  return html`
		<ul class="page-tabs">
			${tabLinks}
  	</li>
	`;
};

export default pageTabs;

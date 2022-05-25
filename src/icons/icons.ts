import chevronRightSvg from "bundle-text:./chevron-right.svg";
import chevronLeftSvg from "bundle-text:./chevron-left.svg";
import "./icons.css";

const buildIcon = (svg) => {
  const iconElement = document.createElement("div");
  iconElement.innerHTML = svg;
  return iconElement.firstElementChild;
};

export const expandIcon = () => buildIcon(chevronRightSvg);
export const collapseIcon = () => buildIcon(chevronLeftSvg);

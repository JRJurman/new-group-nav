import { registerHtml, TramOneComponent } from "tram-one";
import { dragControlIcon } from "../icons";
import "./page-drag-control.css";

const html = registerHtml();

const pageDragControl: TramOneComponent<{ index: number }> = ({ index }) => {
  const onMouseMove = (event) => {
    // set the divider height as a percent from the top of the window
    chrome.storage.local.set({
      dividerHeight: event.pageY / window.innerHeight,
    });
  };

  const startListeners = () => {
    // Attach the listeners to document so that we can track the mouse movement
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", stopListeners);
  };

  const stopListeners = () => {
    // Clean up listeners (after we've lifted the mouse)
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", stopListeners);
  };

  const startDragging = (event) => {
    // start listeners for handling cursor movement
    startListeners();
  };

  return html`
    <button
      aria-label="resize"
      class="page-drag-control"
      onmousedown=${startDragging}
      tabindex="-1"
    >
      ${dragControlIcon()}
    </button>
  `;
};

export default pageDragControl;

import { render } from "solid-js/web";
import WideScreenButton from "./components/WideScreenButton/WideScreenButton"

let mvContainer: HTMLElement | null = null;
let mvLayer: HTMLElement | null = null;
let mvPlayerBox: HTMLElement | null = null;
let videoplayer: HTMLElement | null = null;
let videoplayerControls: HTMLElement | null = null;

const button = document.createElement("div");
button.classList.add("videoplayer_controls_item");
button.classList.add("videoplayer_btn");
button.setAttribute("role", "button");
button.setAttribute("aria-label", "Широкоформатный режим");
button.setAttribute("tabindex", "0");
let disposeButton: () => void = () => { };

const mutatioinObserver = new MutationObserver((mutations) => {
      // drop body mutations if there is container
      if ((mvContainer || mvLayer)
            && (mutations.length === mutations.filter(mutation => mutation.target === document.body).length)) {
            return;
      }

      for (const mutation of mutations) {
            if (mutation.type === "childList") {
                  for (const node of mutation.removedNodes) {
                        if (node instanceof HTMLElement &&
                              node.id === "mv_player_box") {
                              videoplayerControls = null;
                              disposeButton();
                              mvPlayerBox = null;
                              videoplayer = null;
                        }

                        if (node instanceof HTMLElement &&
                              (node.id === "mv_container" || node.id === "mv_layer")) {
                              mvContainer = null;
                              mvLayer = null;
                              videoplayerControls = null;
                              disposeButton();
                              mvPlayerBox = null;
                              videoplayer = null;
                        }
                  }
            }
      }

      renderWideScreenButton();

      if (mvPlayerBox?.innerHTML.length === 0 || mvPlayerBox?.innerText.length === 0 || mvPlayerBox?.childElementCount === 0) {
            videoplayerControls = null;
            disposeButton();
            videoplayer = null;
            mvPlayerBox = null;
      }
});

mutatioinObserver.observe(document.body, {
      subtree: false,
      childList: true,
      attributes: false,
});

function renderWideScreenButton() {
      if (!mvLayer) {
            mvLayer = document.body.querySelector("#mv_layer");

            if (mvLayer)
                  mutatioinObserver.observe(mvLayer, {
                        subtree: false,
                        childList: true,
                        attributes: false,
                  });
      }

      if (!mvContainer && mvLayer) {
            mvContainer = mvLayer.querySelector("#mv_container");

            if (mvContainer)
                  mutatioinObserver.observe(mvContainer, {
                        subtree: false,
                        childList: true,
                        attributes: false,
                  });
      }

      if (!mvPlayerBox && mvContainer) {
            mvPlayerBox = mvContainer.querySelector("#mv_player_box");

            if (mvPlayerBox) {
                  mutatioinObserver.observe(mvPlayerBox, {
                        subtree: false,
                        childList: true,
                        attributes: false,
                  });

                  videoplayer = mvPlayerBox.querySelector(".video_box_wrap");

                  if (videoplayer)
                        mutatioinObserver.observe(videoplayer, {
                              subtree: false,
                              childList: true,
                              attributes: false,
                        });
            }
      }

      if (mvPlayerBox && !videoplayerControls) {
            videoplayerControls = mvPlayerBox.querySelector(".videoplayer_controls");

            if (videoplayerControls) {
                  videoplayerControls.insertBefore(button, videoplayerControls.querySelector(".videoplayer_btn_fullscreen"));

                  disposeButton = render(() => <WideScreenButton />, button);
            }
      }
}

document.addEventListener("DOMContentLoaded", () => {
      renderWideScreenButton();
});


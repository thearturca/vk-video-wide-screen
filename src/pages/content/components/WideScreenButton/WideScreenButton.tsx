import { createEffect, createSignal, JSX, onCleanup, onMount, Show } from "solid-js";
import { createStore } from "solid-js/store";
import "./WideScreenButton.module.css";
import { TbViewportNarrow, TbViewportWide } from 'solid-icons/tb'

const [containerStyle, setContainerStyle] = createStore({
      "height": "auto",
      "width": "1276px",
      "--player-height": "537.75px",
      "--player-width": "956px",
      "hidePlaylist": false,
      "playerBoxHeight": "537.75px",
});

const [isWideScreen, setIsWideScreen] = createSignal(false);

function applyWideScreen(element: HTMLElement, isWide: boolean) {
      if (isWide) {
            if (element.style.getPropertyValue("width") === "100vw"
                  && element.style.getPropertyValue("margin-top") === "0"
                  && element.style.getPropertyValue("--player-height") === "100vh"
                  && element.style.getPropertyValue("--player-width") === "100vw")
                  return;

            element.style.setProperty("width", "100vw")
            element.style.setProperty("margin-top", "0")
            element.style.setProperty("--player-height", "100vh")
            element.style.setProperty("--player-width", "100vw")
      } else {
            if (element.style.getPropertyValue("width") === containerStyle.width
                  && element.style.getPropertyValue("height") === containerStyle.height
                  && element.style.getPropertyValue("--player-height") === containerStyle["--player-height"]
                  && element.style.getPropertyValue("--player-width") === containerStyle["--player-width"]
            )
                  return;

            element.style.setProperty("width", containerStyle.width);
            element.style.setProperty("height", containerStyle.height);
            element.style.setProperty("--player-height", containerStyle["--player-height"]);
            element.style.setProperty("--player-width", containerStyle["--player-width"]);
            element.style.removeProperty("margin-top");
      }
}

function setPlaylistDisplay(element: HTMLElement, isWide: boolean) {
      if (isWide) {
            element.classList.add("_hide_playlist")
      } else {
            if (containerStyle.hidePlaylist)

                  element.classList.add("_hide_playlist")
            else
                  element.classList.remove("_hide_playlist")
      }
}

function setPlayerBoxHeight(element: HTMLElement, isWide: boolean) {
      if (isWide) {
            element.style.setProperty("height", "90vh");
      } else {
            element.style.setProperty("height", containerStyle.playerBoxHeight);
      }
}

const WideScreenButton: () => JSX.Element = () => {
      let mvContainer: HTMLDivElement | null;
      let mvBox: HTMLDivElement | null;
      let mvPlayerBox: HTMLDivElement | null;

      const toggleWideScreen = () => {
            setIsWideScreen((isWideScreen) => !isWideScreen);
      }

      onMount(() => {
            mvContainer = document.body.querySelector("#mv_container");

            window.addEventListener("resize", () => {
                  const isWide = isWideScreen();
                  if (mvContainer)
                        applyWideScreen(mvContainer, isWide);

                  if (mvBox)
                        setPlaylistDisplay(mvBox, isWide);

                  if (mvPlayerBox)
                        setPlayerBoxHeight(mvPlayerBox, isWide);
            });

            if (mvContainer) {
                  setContainerStyle("width", mvContainer.style.getPropertyValue("width"));
                  setContainerStyle("height", mvContainer.style.getPropertyValue("height"));
                  setContainerStyle("--player-height", mvContainer.style.getPropertyValue("--player-height"));
                  setContainerStyle("--player-width", mvContainer.style.getPropertyValue("--player-width"));

                  mvBox = document.body.querySelector("#mv_box");

                  applyWideScreen(mvContainer, isWideScreen());

                  if (mvBox) {
                        containerStyle.hidePlaylist = mvBox.classList.contains("_hide_playlist");
                        setPlaylistDisplay(mvBox, isWideScreen());
                  }

                  mvPlayerBox = document.body.querySelector("#mv_player_box");

                  if (mvPlayerBox) {
                        setContainerStyle("playerBoxHeight", mvPlayerBox.style.getPropertyValue("height"));
                        setPlayerBoxHeight(mvPlayerBox, isWideScreen());
                  }
            }
      });

      createEffect(() => {
            if (!mvContainer)
                  return;

            const isWide = isWideScreen();
            applyWideScreen(mvContainer, isWide);

            if (mvBox)
                  setPlaylistDisplay(mvBox, isWide);

            if (mvPlayerBox)
                  setPlayerBoxHeight(mvPlayerBox, isWide);
      });

      onCleanup(() => {
            if (mvContainer) {
                  applyWideScreen(mvContainer, false);
                  setPlaylistDisplay(mvBox, false);
                  setPlayerBoxHeight(mvPlayerBox, false);
                  mvContainer = null;
                  mvBox = null;
                  mvPlayerBox = null;
            }
      });

      return (
            <div
                  onMouseUp={(e) => {
                        if (e.button === 0)
                              toggleWideScreen()
                  }}

                  style={{
                        display: "flex",
                        "align-items": "center",
                        "justify-content": "center",
                        "margin-right": "0.25rem",
                  }}
            >
                  <Show when={isWideScreen()} fallback={<TbViewportWide style={{ width: "1.25rem", height: "1.25rem" }} />}>
                        <TbViewportNarrow style={{ width: "1.25rem", height: "1.25rem" }} />
                  </Show>
            </div>
      );
};

export default WideScreenButton;

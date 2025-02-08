import * as ex from "excalibur";
import { render } from "preact";
import { CrtVisual } from "./crtvisual";
import { TerminalContextProvider } from "react-terminal";
// import { AstralPlane } from "./telepathy";
import "./index.css";
import { MainScene } from "./scenes/main";
import { resources, sounds, dsml1 } from "./resources";
import { addPermission } from "./permission";

import { createLoader } from "./helpers/loader";

import logo from "./assets/logo512.png";
import { useEffect, useState } from "preact/hooks";

function App() {
  
  let game = null;
  let [crtBox, setCrtBox] = useState(null);

  function setViewport(){
    const topLeft = game.screen.screenToPageCoordinates(ex.vec(0,0))
    const bottomRight = game.screen.screenToPageCoordinates(ex.vec(800, 480))
    setCrtBox(new ex.BoundingBox(topLeft.x, topLeft.y, bottomRight.x, bottomRight.y))
  }

  useEffect(() => {
    game = new ex.Engine({
      width: 800,
      height: 480,
      displayMode: ex.DisplayMode.FitContainer,
      canvasElementId: "game_canvas",
      backgroundColor: ex.Color.Black,
      pixelArt: true,
      physics: {
        solver: ex.SolverStrategy.Arcade,
      },
    });
    window._game = game

    const loader = createLoader(
      game,
      [dsml1, ...resources, ...Object.values(sounds)],
      logo
    );

    game.start(loader).then(() => {
      setViewport()
      const mainScene = new MainScene();
      game.add("main", mainScene);
      game.goToScene("main");
      //game.canvas.focus();
      game.screen.events.on("resize", setViewport);
    });

  }, []);

  return (
    <TerminalContextProvider>
      <CrtVisual crtBox={crtBox} />
    </TerminalContextProvider>
  );
}

render(<App />, document.getElementById("app"));

document.body.addEventListener("click", function handler() {
  this.removeEventListener("click", handler);
  addPermission();
});
document.getElementById("game").onclick = (ev) => {
  ev.target.focus();
};

window.ex = ex;

import * as ex from "excalibur";
import { render } from "preact";
import { CrtVisual } from "./crtvisual";
import { AstralPlane } from "./telepathy";
import "./index.css";
import { MainScene } from "./scenes/main";
import { resources, sounds, dsml1 } from "./resources";
import { addPermission } from "./permission";

import { createLoader } from "./helpers/loader";

import logo from "./assets/logo512.png";

render(
  <>
    <CrtVisual />
    <AstralPlane />
  </>,
  document.getElementById("app")
);

const game = new ex.Engine({
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
const loader = createLoader(game, [dsml1, ...resources, ...Object.values(sounds)], logo);
window.loader = loader;

document.body.addEventListener("click", function handler() {
  this.removeEventListener("click", handler);
  addPermission();
});
document.getElementById("game").onclick = (ev) => {
  ev.target.focus();
};

game.start(loader).then(() => {
  const mainScene = new MainScene();
  game.add("main", mainScene);
  game.goToScene("main");
  game.canvas.focus();
});
window.dsml1 = dsml1;
window.game = game;
window.ex = ex;

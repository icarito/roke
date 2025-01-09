import * as ex from "excalibur";
import { render } from "preact";
import { Player } from "./player";
// import { Capsule } from "./capsule";
// import { Coin } from "./money";
import { resources, dsml1 } from "./resources";
import { addPermission } from "./permission";
import "@xterm/xterm/css/xterm.css";
import "./index.css";
import logo from "./assets/logo512.png";
import { CrtTerminal } from "./crtterminal";
import { CrtVisual } from "./crtvisual";

ex.Flags.useCanvasGraphicsContext();

render(
  <>
    <CrtVisual />
    <CrtTerminal />
  </>,
  document.getElementById("app")
);

const game = new ex.Engine({
  width: 640,
  height: 480,
  displayMode: ex.DisplayMode.Fixed,
  canvasElementId: "game_canvas",
  backgroundColor: ex.Color.Black,
  pixelArt: true,
  physics: {
    solver: ex.SolverStrategy.Realistic,
  },
});
const loader = new ex.Loader([dsml1, ...resources]);
loader.backgroundColor = "#020610";
loader.logo = logo;
loader.logoHeight = 322;
loader.logoWidth = 512;
loader.events.on("loadresourcestart", () => {
  loader.logoPosition = ex.vec(game.screen.width / 2 - 256, 0);
  loader.loadingBarPosition = ex.vec(game.screen.width / 2 - 250, game.screen.height - 40);
})
loader.events.on("useraction", () => {
  ex.WebAudio.unlock()
  addPermission();
})
loader.loadingBarHeight = 10;
loader.loadingBarColor = ex.Color.Yellow;
loader.suppressPlayButton = true;
window.loader = loader

document.body.addEventListener("click", function handler() {
  this.removeEventListener("click", handler);
});
document.getElementById("game").onclick = (ev) => {
  ev.target.focus();
};

game.start(loader).then(() => {
  game.currentScene.physics.config.gravity = ex.vec(0, 200);
  let player = new Player(492, 50);
  dsml1.addToScene(game.currentScene);
  game.add(player);

  // setInterval(() => {
  //   let coin = new Coin(20, 20);
  //   coin.vel = ex.vec(Math.random() * 100 - 50, Math.random() * -100 - 50);
  //   game.add(coin)
  // }, 500)
  window.player = player;
  game.currentScene.camera.strategy.elasticToActor(player, 0.3, 0.8);
  game.currentScene.camera.pos = player.pos;
  game.currentScene.camera.zoom = 3;
  let boundingBox = new ex.BoundingBox(
    0,
    0,
    dsml1.data.levels[0].pxWid,
    dsml1.data.levels[0].pxHei
  );
  game.currentScene.camera.strategy.limitCameraBounds(boundingBox);
  game.currentScene.camera.zoomOverTime(2, 2000);
  game.canvas.focus()
});

window.onfocus = ()=>game.start()
window.onblur = ()=>game.stop()

window.dsml1 = dsml1;
window.game = game;
window.ex = ex;

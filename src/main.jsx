import * as ex from "excalibur";
import { Player } from "./player";
// import { Capsule } from "./capsule";
// import { Coin } from "./money";
import { resources, dsml1 } from "./resources";
import { addPermission } from "./permission";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import "./index.css";
import logo from "./assets/logo640.png";

//ex.Flags.useCanvasGraphicsContext();

const game = new ex.Engine({
  resolution: { width: 800, height: 480 },
  displayMode: ex.DisplayMode.FitContainerAndFill,
  canvasElementId: "game",
  backgroundColor: ex.Color.Black,
  pixelArt: true,
  physics: {
    solver: ex.SolverStrategy.Realistic,
  },
});
const loader = new ex.Loader([dsml1, ...resources]);
loader.playButtonText = 'NOCLIP ⚠️';
loader.backgroundColor = '#020610';
loader.logo = logo;
loader.logoHeight = 480;
loader.logoWidth = 640;
loader.logoPosition = ex.vec(game.screen.width / 2 - 320, 0);
loader.loadingBarPosition = ex.vec(game.screen.width / 2 - 320, 380);
loader.loadingBarHeight = 10;
loader.loadingBarColor = ex.Color.Yellow;
loader.suppressPlayButton = true;

let term = new Terminal({ fontSize: 20, fontFamily: "monospace", backgroundColor: "#020610" });
let fit = new FitAddon();
term.loadAddon(fit);
term.open(document.getElementById('game_ui'))
term.onKey(e => {
  console.log(e.key);
  term.write(e.key);
  if (e.key == '\r')
      term.write('\n');
})

fit.fit()

term.write('Hello \x1B[1;3;31mR.O.K.E.\x1B[0m... ')

document.body.addEventListener("click", function handler() {
  this.removeEventListener("click", handler);
  addPermission();
});
document.getElementById('game').onclick = (ev)=> {
  ev.target.focus()
}

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
  window.player = player
  game.currentScene.camera.strategy.elasticToActor(player, 0.3, 0.8);
  game.currentScene.camera.pos = player.pos
  game.currentScene.camera.zoom = 3
  let boundingBox = new ex.BoundingBox(0, 0, dsml1.data.levels[0].pxWid, dsml1.data.levels[0].pxHei);
  game.currentScene.camera.strategy.limitCameraBounds(boundingBox);
  game.currentScene.camera.zoomOverTime(2, 2000);
});


window.dsml1 = dsml1
window.game = game
window.ex = ex
window.term = term
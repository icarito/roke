import * as ex from "excalibur";
import { Player } from "./player";
import { Capsule } from "./capsule";
import { Coin } from "./money";
import "./index.css";
import { resources, dsml1 } from "./resources";
import { addPermission } from "./permission";

//ex.Flags.useCanvasGraphicsContext();

const game = new ex.Engine({
  resolution: { width: 800, height: 480 },
  displayMode: ex.DisplayMode.FitContainer,
  canvasElementId: "game",
  backgroundColor: ex.Color.Black,
  pixelArt: true,
  physics: {
    solver: ex.SolverStrategy.Realistic,
  },
});
const loader = new ex.Loader([dsml1, ...resources]);

document.body.addEventListener("click", function handler(event) {
  this.removeEventListener("click", handler);
  addPermission();
});


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
  let boundingBox = new ex.BoundingBox(0, 0, dsml1.data.levels[0].pxWid, dsml1.data.levels[0].pxHei);
  game.currentScene.camera.strategy.limitCameraBounds(boundingBox);
  game.currentScene.camera.zoomOverTime(2, 2000);
});


window.dsml1 = dsml1
window.game = game
window.ex = ex
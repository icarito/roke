import * as ex from "excalibur";
import { Player } from "./player";
import { Capsule } from "./capsule";
import "./index.css";
import { resources, dsml1 } from "./resources";
import { addPermission } from "./permission";

ex.Flags.useCanvasGraphicsContext();

const game = new ex.Engine({
  resolution: { width: 256, height: 256 },
  pixelArt: true,
  canvasElementId: "game",
});
const loader = new ex.Loader([dsml1, ...resources]);

document.body.addEventListener("click", function handler(event) {
  this.removeEventListener("click", handler);
  addPermission();
});

game.currentScene.onInitialize = (e) => {
  console.log(e);
  dsml1.addToScene(e.currentScene, {
    pos: ex.vec(0, 0),
  });
};

game.start(loader).then(() => {
  game.currentScene.physics.config.solver = ex.SolverStrategy.Realistic;
  game.currentScene.physics.config.gravity = ex.vec(0, 300);
  game.add(new Capsule(0, 0, game.screen.width, game.screen.height));
  let player = new Player();
  game.add(player);
  window.ex = ex;
  window.dsml1 = dsml1;
  window.game = game;
  window.resources = resources;
  window.player = player;
  //game.currentScene.camera.clearAllStrategies();
  //game.currentScene.camera.strategy.lockToActor(player);
  const bounds = dsml1.getLevelBounds(["Level_0"]);
  console.log(bounds);
});

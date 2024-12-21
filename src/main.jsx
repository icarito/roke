import * as ex from "excalibur";
import { Player } from "./player";
import { Capsule } from "./capsule";
import "./index.css";
import { resources, dsml1 } from "./resources";
import { addPermission } from "./permission";

ex.Flags.useCanvasGraphicsContext();

const game = new ex.Engine({
  canvasElementId: "game",
  physics: {
    solver: ex.SolverStrategy.Realistic,
  }
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
  game.currentScene.physics.config.gravity = ex.vec(0, 100);
  let player = new Player();
  game.add(player);
  window.ex = ex;
  window.dsml1 = dsml1;
  window.game = game;
  window.resources = resources;
  window.player = player;
  //game.currentScene.camera.clearAllStrategies();
  //game.currentScene.camera.strategy.lockToActor(player);
  //game.add(new Capsule(0, 0, game.screen.width, game.screen.height));
});

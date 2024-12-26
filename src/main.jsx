import * as ex from "excalibur";
import { Player } from "./player";
import { Capsule } from "./capsule";
import "./index.css";
import { resources, dsml1 } from "./resources";
import { addPermission } from "./permission";

ex.Flags.useCanvasGraphicsContext();

const game = new ex.Engine({
  displayMode: ex.DisplayMode.FillContainer,
  canvasElementId: "game",
  backgroundColor: ex.Color.Black,
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
  let player = new Player();
  game.add(new Capsule(0, 0, game.screen.width, game.screen.height));
  game.add(player);
  game.currentScene.camera.strategy.elasticToActor(player, 0.3, 0.8);
  let boundingBox = new ex.BoundingBox(0, 0, game.screen.width, game.screen.height);
  game.currentScene.camera.strategy.limitCameraBounds(boundingBox);
  game.currentScene.camera.zoomOverTime(2, 2000);
});

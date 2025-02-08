// systems/MovementSystem.js
import * as ex from "excalibur";

export class ControlComponent extends ex.Component {
  static type = "movement";

  constructor() {
    super();
  }
}

export class ControlSystem extends ex.System {
  types = ["movement"];
  systemType = ex.SystemType.Update;

  constructor(world) {
    super();
    this.query = world.query([ControlComponent]);
  }

  initialize(world, scene) {
    this.engine = scene.engine;
  }

  update(delta) {
    const engine = this.engine;
    this.query.entities.forEach((entity) => {
      const moveComp = entity.get(ControlComponent);
      if (moveComp) {
        if (engine.input.keyboard.isHeld(ex.Keys.Space)) {
          entity.vel.addEqual(ex.vec(0, -50));
        }

        if (
          engine.input.keyboard.isHeld(ex.Keys.Up) ||
          engine.input.gamepads.at(0).getAxes(ex.Axes.LeftStickY) > 0.5
        ) {
          entity.vel.addEqual(ex.vec(0, -10));
        }
        if (
          engine.input.keyboard.isHeld(ex.Keys.Left) ||
          engine.input.gamepads.at(0).getAxes(ex.Axes.LeftStickX) < -0.5
        ) {
          entity.vel.addEqual(ex.vec(-10, 0));
        }
        if (
          engine.input.keyboard.isHeld(ex.Keys.Right) ||
          engine.input.gamepads.at(0).getAxes(ex.Axes.LeftStickX) > 0.5
        ) {
          entity.vel.addEqual(ex.vec(10, 0));
        }
      }
    });
  }
}

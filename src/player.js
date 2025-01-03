import { Actor, Color, vec, clamp } from "excalibur";
import * as ex from "excalibur";
import { Motion } from "@capacitor/motion";
import { idleMan, walkMan, runMan, flyMan } from "./resources";
import { isSafari } from "./permission";

export class Player extends Actor {
  constructor(x, y) {
    super({
      name: "Roke",
      pos: vec(x, y),
      width: 36,
      height: 72,
      anchor: vec(0.5, 0.95),
      scale: vec(0.2, 0.2),
      collisionType: ex.CollisionType.Active,
    });
    Motion.addListener("accel", (e) => this.handleAccel(e));
  }
  update(engine, delta) {
    if (engine.input.keyboard.wasPressed(ex.Keys.Enter)) {
      window.dsml1.retile()
    }
    
    // *** Control

    if (
      engine.input.keyboard.isHeld(ex.Keys.Up) ||
      engine.input.gamepads.at(0).getAxes(ex.Axes.LeftStickY) > 0.5
    ) {
      this.vel.addEqual(ex.vec(0, -10));
    }
    if (
      engine.input.keyboard.isHeld(ex.Keys.Left) ||
      engine.input.gamepads.at(0).getAxes(ex.Axes.LeftStickX) < -0.5
    ) {
      this.vel.addEqual(ex.vec(-10, 0));
    }
    if (
      engine.input.keyboard.isHeld(ex.Keys.Right) ||
      engine.input.gamepads.at(0).getAxes(ex.Axes.LeftStickX) > 0.5
    ) {
      this.vel.addEqual(ex.vec(10, 0));
    }

    // *** Animaciones

    if (this.vel.y > 90) {
      this.graphics.use(flyMan);
    } else if (Math.abs(this.vel.x) > 120) {
      this.graphics.use(runMan);
    } else if (Math.abs(this.vel.x) > 2) {
      this.graphics.use(walkMan);
    } else {
      this.graphics.use(idleMan);
    }
    if (this.vel.x > 0.1) {
      this.graphics.flipHorizontal = false;
    } else if (this.vel.x < -0.1) {
      this.graphics.flipHorizontal = true;
    }
  }
  handleAccel(event) {
    if (
      ex.vec(
        event.accelerationIncludingGravity.x,
        event.accelerationIncludingGravity.y
      ).magnitude > 2
    ) {
      if (isSafari) {
        this.vel.addEqual(
          ex.vec(
            event.accelerationIncludingGravity.x,
            -event.accelerationIncludingGravity.y < 0 ? -event.accelerationIncludingGravity.y : 0
          )
        );
      } else {
        this.vel.addEqual(
          ex.vec(
            -event.accelerationIncludingGravity.x,
            event.accelerationIncludingGravity.y < 0 ? event.accelerationIncludingGravity.y : 0
          )
        );
      }
    }
  }
}

import { Actor, Color, vec } from "excalibur";
import * as ex from "excalibur";
import { Motion } from "@capacitor/motion";
import { resources } from "./resources";
import { isSafari } from "./permission";

const [idleMan0, idleMan1, idleMan2, idleMan3, walkMan0, walkMan1, walkMan2,
  walkMan3, walkMan4, walkMan5, walkMan6, walkMan7, runMan0, 
  runMan1, runMan2, runMan3, runMan4, runMan5, runMan6, runMan7,
  flyMan0, flyMan1] = resources;

const click = 100;
const idleMan = new ex.Animation({
  frames: [idleMan0, idleMan1, idleMan2, idleMan3, idleMan2, idleMan1].map(
    (res) => ({
      graphic: res.toSprite(),
      duration: click,
    })
  ),
});
const walkMan = new ex.Animation({
  frames: [walkMan0, walkMan1, walkMan2, walkMan3, walkMan4, walkMan5, walkMan6, walkMan7].map(res=>({
    graphic: res.toSprite(),
    duration: click,
  })),
});
const runMan = new ex.Animation({
  frames: [runMan0, runMan1, runMan2, runMan3, runMan4, runMan5, runMan6, runMan7].map(res=>({
    graphic: res.toSprite(),
    duration: click,
  })),
});
const flyMan = new ex.Animation({
  frames: [flyMan0, flyMan1].map(res=>({
   graphic: res.toSprite(),
   duration:click
 })),
});
export class Player extends Actor {
  constructor() {
    super({
      pos: vec(200, 300),
      width: 32,
      height: 64,
      anchor: vec(0.5, 0.8),
      color: Color.Yellow,
      collisionType: ex.CollisionType.Active,
    });
    Motion.addListener("accel", (event) => {
      if (isSafari) {
        this.vel.addEqual(
          ex.vec(
            event.accelerationIncludingGravity.x,
            -event.accelerationIncludingGravity.y
          )
        );
      } else {
        this.vel.addEqual(
          ex.vec(
            -event.accelerationIncludingGravity.x,
            event.accelerationIncludingGravity.y
          )
        );
      }
    });
  }
  update(engine, delta) {
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
    if (this.vel.y > 90) {
        this.graphics.use(flyMan);
    } else if (Math.abs(this.vel.x) > 120) {
      this.graphics.use(runMan);
    }
    else if (Math.abs(this.vel.x) > 1) {
      this.graphics.use(walkMan);
    }
    else {
      this.graphics.use(idleMan);
    }
    if (this.vel.x > 0.1) {
      this.graphics.flipHorizontal = false;
    } else if (this.vel.x < -0.1) {
      this.graphics.flipHorizontal = true;
    }
  }
}

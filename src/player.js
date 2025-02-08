import { Actor, vec } from "excalibur";
import * as ex from "excalibur";
import { Motion } from "@capacitor/motion";
import { idleMan, walkMan, runMan, flyMan, sounds } from "./resources";
import { isSafari } from "./permission";
import { getRoom } from "./backrooms";
import { getOrSet } from "./util";
import { ControlComponent } from "./systems/control";

export class Player extends Actor {
  status = {
    firstGame: getOrSet("firstGame", Date.now()),
    location: {
      level: getOrSet("level", "Level 0"),
      room: parseInt(getOrSet("room", 0)),
    },
  };
  world = null;
  scene = null;

  constructor(scene, x, y) {
    super({
      name: getOrSet("name", "Roke"),
      pos: vec(x, y),
      width: 36,
      height: 72,
      anchor: vec(0.5, 0.95),
      scale: vec(0.4, 0.4),
      z: 1,
      collisionType: ex.CollisionType.Active,
    });
    this.addComponent(new ControlComponent());
    Motion.addListener("accel", (e) => this.handleAccel(e));
    this.world = getRoom(this);
    this.scene = scene;
    window._player = this;
    window._flyman = flyMan
  }

  update(engine, delta) {
    super.update(engine, delta);
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

  experiment() {
    sounds.enter.play(0.5);
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
            -event.accelerationIncludingGravity.y < 0
              ? -event.accelerationIncludingGravity.y
              : 0
          )
        );
      } else {
        this.vel.addEqual(
          ex.vec(
            -event.accelerationIncludingGravity.x,
            event.accelerationIncludingGravity.y < 0
              ? event.accelerationIncludingGravity.y
              : 0
          )
        );
      }
    }
  }
}

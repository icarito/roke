import { Actor, vec } from "excalibur";
import * as ex from "excalibur";
import { Motion } from "@capacitor/motion";
import { idleMan, walkMan, runMan, flyMan } from "./resources";
import { isSafari } from "./permission";
import { getRoom } from "./backrooms";
import { getOrSet } from "./util";
import { addPortal, clearPortals } from "./room";
import { RNG } from "rot-js"

export class Player extends Actor {
  status = {
    firstGame: getOrSet("firstGame", Date.now()),
    location: { level: getOrSet("level", "Level 0"), room: parseInt(getOrSet("room", 0)) }
  };
  world = null;
  gotoRoom(roomNumber) {
    const tilemap = window.dsml1.getIntGridLayers()[0].tilemap;

    this.status.location = { level: this.world.level, 
                              room: roomNumber };
    this.status.enteredRoom = Date.now();
    window.game.stop();
    this.world = getRoom(this);
    let tilepos = vec((this.pos.x % 32) + 16, this.pos.y % 32);
    window.dsml1.retile(this.world.checksum).then((map) => {
      let firstRoom = map.getRooms()[0];
      let lastRoom = map.getRooms()[map.getRooms().length - 1];
 
      if (this.pos.x < 0){
        this.pos = vec(map._width * 32  - 32, lastRoom.getBottom() * 32).add(tilepos)
      }
      else if (this.pos.x > tilemap.width) {
        this.pos = vec(0, firstRoom.getBottom() * 32).add(tilepos);
      }

      clearPortals()

      const [x, y] = RNG.getItem(map.getRooms()).getCenter()
      addPortal(x * 32, y * 32)

      window.game.currentScene.camera.pos = this.pos;
      window.game.start();
    });
  }
  constructor(x, y) {
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
    Motion.addListener("accel", (e) => this.handleAccel(e));
    this.world = getRoom(this);
  }
  update(engine) {
    const tilemap = window.dsml1.getIntGridLayers()[0].tilemap;
    if (this.pos.x >= tilemap.width) {
      this.gotoRoom(this.status.location.room + 1)
    }
    if (this.pos.x <= 0) {
      this.gotoRoom(this.status.location.room - 1)
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

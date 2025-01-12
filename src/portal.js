import { portalAnims } from "./resources";
import * as ex from 'excalibur';
import { RNG } from "rot-js";

window.rng = RNG

export class Portal extends ex.Actor {
  constructor(x, y) {
    super({
      x: x,
      y: y,
      width: 32,
      height: 48,
      anchor: ex.vec(0.5, 1),
      z: 0,
      collisionType: ex.CollisionType.Passive,
    });
    this.graphics.add(RNG.getItem(portalAnims));
  }
}
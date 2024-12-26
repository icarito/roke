import * as ex from "excalibur";
import { City } from "./city";
import { cityBack } from "./resources";

function colliderBox(x, y, width, height) {
  return new ex.CompositeCollider([
    new ex.EdgeCollider({ begin: ex.vec(x, y), end: ex.vec(width, y) }),
    new ex.EdgeCollider({ begin: ex.vec(x, y), end: ex.vec(x, height) }),
    new ex.EdgeCollider({ begin: ex.vec(width, y), end: ex.vec(width, height) }),
    new ex.EdgeCollider({ begin: ex.vec(x, height), end: ex.vec(width, height) }),
  ]);
}

export class Capsule extends ex.Actor {
  constructor(x, y, width, height) {
    super({
      x: x,
      y: y,
      width: width,
      height: height,
      collisionType: ex.CollisionType.Fixed,
      collider: colliderBox(x, y, width, height),
      anchor: ex.vec(0, 0),
    });
  }
  onInitialize() {
    cityBack.width = this.width - 20;
    cityBack.height = this.height - 20;
    this.graphics.use(
      cityBack
    );
    this.addChild(new City(0, this.height/2, this.width, this.height))
  }
}

import * as ex from 'excalibur';

const buildingOpacity = 0.8
const buildingPalette = [
  ex.Color.fromRGB(153,69,102, buildingOpacity),
  ex.Color.fromRGB(206,97,118, buildingOpacity),
  ex.Color.fromRGB(222,153,182, buildingOpacity),
]

function choice(arr){
  const index = ex.randomIntInRange(0, arr.length - 1);
  return arr[index];
}

class Building extends ex.Actor {
  constructor(x, y, width, height) {
    super({
      x: x,
      y: y,
      color: choice(buildingPalette),
      width: width,
      height: height,
      anchor: ex.vec(0, 0),
      collisionType: ex.CollisionType.Fixed
    });
  }
}

export class City extends ex.Entity {
  constructor(x, y, width, height) {
    super({
      x: x,
      y: y
    });
    let buildingWidth = 100;
    for (let n = 0; n < width; n += buildingWidth) {
      let thisHeight = ex.randomInRange(60, 400);
      this.addChild(new Building(n, height - thisHeight, buildingWidth, thisHeight));
    }
  }
}
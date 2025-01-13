import * as ex from "excalibur";
import { AutoMap } from "./automap";

import idleMan0 from "./assets/L/obj_Idle000.png";
import idleMan1 from "./assets/L/obj_Idle001.png";
import idleMan2 from "./assets/L/obj_Idle002.png";
import idleMan3 from "./assets/L/obj_Idle003.png";
import walkMan0 from "./assets/L/obj_Walk000.png";
import walkMan1 from "./assets/L/obj_Walk001.png";
import walkMan2 from "./assets/L/obj_Walk002.png";
import walkMan3 from "./assets/L/obj_Walk003.png";
import walkMan4 from "./assets/L/obj_Walk004.png";
import walkMan5 from "./assets/L/obj_Walk005.png";
import walkMan6 from "./assets/L/obj_Walk006.png";
import walkMan7 from "./assets/L/obj_Walk007.png";
import runMan0 from "./assets/L/obj_Run000.png";
import runMan1 from "./assets/L/obj_Run001.png";
import runMan2 from "./assets/L/obj_Run002.png";
import runMan3 from "./assets/L/obj_Run003.png";
import runMan4 from "./assets/L/obj_Run004.png";
import runMan5 from "./assets/L/obj_Run005.png";
import runMan6 from "./assets/L/obj_Run006.png";
import runMan7 from "./assets/L/obj_Run007.png";
import flyMan0 from "./assets/L/obj_Flying000.png";
import flyMan1 from "./assets/L/obj_Flying001.png";
import coin from "./assets/coins.png";
import portals from "./assets/portalsSpriteSheet.png"
import caverna from "./assets/maps/Cavernas_by_Adam_Saltsman.png";
import scifitm from "./assets/maps/scifi_platformTiles_32x32.png";
import vsl0_level from "./assets/maps/vsm0/Level_0.ldtkl?url";
import vsl0_map from "./assets/maps/vsm0.ldtk?url";
import cityBackFull from "./assets/back/city/10.png";

// sonidos

import enter from "./assets/sounds/elemental-magic-spell-impact-outgoing-228342.mp3";


export const dsml1 = new AutoMap(vsl0_map, {
  pathMap: [
    { path: "vsm0/Level_0.ldtk", output: vsl0_level },
    { path: "Cavernas_by_Adam_Saltsman.png", output: caverna },
    { path: "scifi_platformTiles_32x32.png", output: scifitm },
  ],
});

export const sounds = {
  enter : new ex.Sound(enter),
};


export const resources = [
  idleMan0,
  idleMan1,
  idleMan2,
  idleMan3,
  walkMan0,
  walkMan1,
  walkMan2,
  walkMan3,
  walkMan4,
  walkMan5,
  walkMan6,
  walkMan7,
  runMan0,
  runMan1,
  runMan2,
  runMan3,
  runMan4,
  runMan5,
  runMan6,
  runMan7,
  flyMan0,
  flyMan1,
  caverna,
  cityBackFull,
  scifitm,
  coin,
  portals,
].map((resource) => new ex.ImageSource(resource));

function resourceByPath(path) {
  return resources.find((res) => res.path === path);
}

const click = 100;
export const idleMan = new ex.Animation({
  frames: [idleMan0, idleMan1, idleMan2, idleMan3, idleMan2, idleMan1].map(
    (res) => ({
      graphic: resourceByPath(res).toSprite(),
      duration: click,
    })
  ),
});
export const walkMan = new ex.Animation({
  frames: [
    walkMan0,
    walkMan1,
    walkMan2,
    walkMan3,
    walkMan4,
    walkMan5,
    walkMan6,
    walkMan7,
  ].map((res) => ({
    graphic: resourceByPath(res).toSprite(),
    duration: click,
  })),
});
export const runMan = new ex.Animation({
  frames: [
    runMan0,
    runMan1,
    runMan2,
    runMan3,
    runMan4,
    runMan5,
    runMan6,
    runMan7,
  ].map((res) => ({
    graphic: resourceByPath(res).toSprite(),
    duration: click,
  })),
});
export const flyMan = new ex.Animation({
  frames: [flyMan0, flyMan1].map((res) => ({
    graphic: resourceByPath(res).toSprite(),
    duration: click,
  })),
});

const coinSheet = ex.SpriteSheet.fromImageSource({
  image: resourceByPath(coin),
  grid: {
    rows: 1,
    columns: 8,
    spriteWidth: 16,
    spriteHeight: 16,
  },
});
const portalSheet = ex.SpriteSheet.fromImageSource({
  image: resourceByPath(portals),
  grid: {
    rows: 4,
    columns: 4,
    spriteWidth: 32,
    spriteHeight: 48,
  },
});

export const coinAnim = ex.Animation.fromSpriteSheet(coinSheet, ex.range(0, 7), 200);
export const portalAnims = [
  ex.Animation.fromSpriteSheet(portalSheet, ex.range(0, 3), 100),
  ex.Animation.fromSpriteSheet(portalSheet, ex.range(4, 7), 100),
  ex.Animation.fromSpriteSheet(portalSheet, ex.range(8, 11), 100),
  ex.Animation.fromSpriteSheet(portalSheet, ex.range(12, 15), 100)
]

export const cityBack = resourceByPath(cityBackFull).toSprite();

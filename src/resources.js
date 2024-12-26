import * as ex from "excalibur";
import { LdtkResource } from "@excaliburjs/plugin-ldtk";

import idleMan0 from "./assets/S/obj_Idle000.png";
import idleMan1 from "./assets/S/obj_Idle001.png";
import idleMan2 from "./assets/S/obj_Idle002.png";
import idleMan3 from "./assets/S/obj_Idle003.png";
import walkMan0 from "./assets/S/obj_Walk000.png";
import walkMan1 from "./assets/S/obj_Walk001.png";
import walkMan2 from "./assets/S/obj_Walk002.png";
import walkMan3 from "./assets/S/obj_Walk003.png";
import walkMan4 from "./assets/S/obj_Walk004.png";
import walkMan5 from "./assets/S/obj_Walk005.png";
import walkMan6 from "./assets/S/obj_Walk006.png";
import walkMan7 from "./assets/S/obj_Walk007.png";
import runMan0 from "./assets/S/obj_Run000.png";
import runMan1 from "./assets/S/obj_Run001.png";
import runMan2 from "./assets/S/obj_Run002.png";
import runMan3 from "./assets/S/obj_Run003.png";
import runMan4 from "./assets/S/obj_Run004.png";
import runMan5 from "./assets/S/obj_Run005.png";
import runMan6 from "./assets/S/obj_Run006.png";
import runMan7 from "./assets/S/obj_Run007.png";
import flyMan0 from "./assets/S/obj_Flying000.png";
import flyMan1 from "./assets/S/obj_Flying001.png";
import caverna from "./assets/maps/Cavernas_by_Adam_Saltsman.png";
import tilemap from "./assets/maps/Solaria Demo Update 01.png";
import dsml1_level from "./assets/maps/dsml1/Cave.ldtkl?url";
import dsml1_map from "./assets/maps/dsml1.ldtk?url";
import cityBackFull from "./assets/back/city/10.png";

export const dsml1 = new LdtkResource(dsml1_map, {
  pathMap: [
    {path: "dsml1/Cave.ldtkl", output: dsml1_level},
    {path: "Cavernas_by_Adam_Saltsman.png", output: caverna},
  ]
});

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
  tilemap,
  cityBackFull,
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
  frames: [walkMan0, walkMan1, walkMan2, walkMan3, walkMan4, walkMan5, walkMan6, walkMan7].map(res=>({
    graphic: resourceByPath(res).toSprite(),
    duration: click,
  })),
});
export const runMan = new ex.Animation({
  frames: [runMan0, runMan1, runMan2, runMan3, runMan4, runMan5, runMan6, runMan7].map(res=>({
    graphic: resourceByPath(res).toSprite(),
    duration: click,
  })),
});
export const flyMan = new ex.Animation({
  frames: [flyMan0, flyMan1].map(res=>({
   graphic: resourceByPath(res).toSprite(),
   duration:click
 })),
});

export const cityBack = resourceByPath(cityBackFull).toSprite();
import * as ex from "excalibur";

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

export const resources = [idleMan0, idleMan1, idleMan2, idleMan3, walkMan0, walkMan1, walkMan2, walkMan3, walkMan4, walkMan5, walkMan6, walkMan7, 
    runMan0, runMan1, runMan2, runMan3, runMan4, runMan5, runMan6, runMan7].map(
    (resource) => new ex.ImageSource(resource)
);

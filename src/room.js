import { Portal } from "./portal";


const room = {
    portals : []
}

export function addPortal(scene, x, y) {
    const portal = new Portal(x, y);
    scene.add(portal)
    room.portals.push(portal);
    return portal
}

export function clearPortals() {
    room.portals.forEach((portal) => {
        portal.kill();
    });
    room.portals = [];
}
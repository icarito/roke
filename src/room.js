import { Portal } from "./portal";


const room = {
    portals : []
}

export function addPortal(x, y) {
    const portal = new Portal(x, y);
    window.game.add(portal)
    room.portals.push(portal);
    return portal
}

export function clearPortals() {
    room.portals.forEach((portal) => {
        portal.kill();
    });
    room.portals = [];
}
// MainScene.js
import * as ex from "excalibur";
import { vec } from "excalibur";
import { Player } from "../player";
import { dsml1, sounds } from "../resources";
import { addPortal, clearPortals } from "../room";
import { RNG } from "rot-js";
import { ControlSystem } from "../systems/control";
import { getRoom } from "../backrooms";

export class MainScene extends ex.Scene {
  constructor() {
    super();
    this.dsml1 = dsml1;
    window._dsml1 = dsml1;
  }

  onInitialize(engine) {
    this.setupLevel(engine);
  }

  async gotoRoom(player, roomNumber) {
    const tilemap = this.dsml1.getIntGridLayers()[0].tilemap;

    player.status.enteredRoom = Date.now();
    player.status.location = { level: player.world.level, room: roomNumber };
    player.world = getRoom(player);
    let tilepos = vec((player.pos.x % 32) + 16, player.pos.y % 32);
    let map = await this.dsml1.retile(player.world.checksum);
    let firstRoom = map.getRooms()[0];
    let lastRoom = map.getRooms()[map.getRooms().length - 1];

    if (player.pos.x < 0) {
      player.pos = vec(map._width * 32 - 32, lastRoom.getBottom() * 32).add(
        tilepos
      );
    } else if (player.pos.x > tilemap.width) {
      player.pos = vec(0, firstRoom.getBottom() * 32).add(tilepos);
    }

    clearPortals();

    const [x, y] = RNG.getItem(map.getRooms().slice(1)).getCenter();
    addPortal(this, x * 32 + 16, y * 32);

    this.engine.currentScene.camera.pos = player.pos;
  }

  setupLevel(engine) {
    engine.currentScene.physics.config.gravity = ex.vec(0, 200);
    let player = new Player(this, 492, 60);
    this.dsml1.addToScene(this);
    let portal = addPortal(this, 492, 50);
    portal.rotation = -Math.PI / 2;
    this.add(portal);
    this.world.add(ControlSystem);
    sounds.enter.play(0.5);
    this.add(player);

    engine.currentScene.camera.strategy.elasticToActor(player, 0.3, 0.8);
    engine.currentScene.camera.pos = player.pos.clone();
    engine.currentScene.camera.zoom = 0.7;

    let boundingBox = new ex.BoundingBox(
      0,
      0,
      this.dsml1.data.levels[0].pxWid,
      this.dsml1.data.levels[0].pxHei
    );
    engine.currentScene.camera.strategy.limitCameraBounds(boundingBox);
    engine.currentScene.camera.zoomOverTime(2, 2000);

    // Add additional update logic without replacing the existing update method
    const originalUpdate = player.update;
    player.update = (engine) => {
      if (originalUpdate) {
        originalUpdate.call(player, engine);
      }

      const tilemap = this.dsml1.getIntGridLayers()[0].tilemap;
      if (player.pos.x >= tilemap.width) {
        engine.stop();
        this.gotoRoom(player, player.status.location.room + 1).then(() => engine.start());
      }
      if (player.pos.x <= 0) {
        engine.stop();
        this.gotoRoom(player, player.status.location.room - 1).then(() => engine.start());
      }
    };
  }

}

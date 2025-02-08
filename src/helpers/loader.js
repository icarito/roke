// ./helpers/loader.js
import * as ex from "excalibur";
import { addPermission } from "../permission";

/**
 * Creates and configures a new Excalibur Loader.
 * @param {Array} resources - Array of game resources to be loaded.
 * @param {String} logo - Path to the logo image.
 * @returns {ex.Loader} - Configured loader instance.
 */
export function createLoader(engine, resources, logo) {
  const loader = new ex.Loader(resources);
  loader.backgroundColor = "#020610";
  loader.logo = logo;
  loader.logoHeight = 322;
  loader.logoWidth = 512;
  loader.loadingBarHeight = 10;
  loader.loadingBarColor = ex.Color.Yellow;
  loader.playButtonText = "Enter";

  loader.events.on("beforeload", () => {
    const gameWidth = engine.screen.width;
    const gameHeight = engine.screen.height;
    loader.logoPosition = ex.vec(gameWidth / 2 - 256, 0);
    loader.loadingBarPosition = ex.vec(gameWidth / 2 - 250, gameHeight - 40);
  });

  return loader;
}
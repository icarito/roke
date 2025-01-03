import { LdtkResource } from "@excaliburjs/plugin-ldtk";
import { Map } from "rot-js";
import vsl0_map from "./assets/maps/vsm0.ldtk?url";
//import vsl0_level from "./assets/maps/vsm0/Level_0.ldtkl?url";
import { generateAutoLayerTiles } from "./autolayer";


async function calcAutoLayer(intGridCsv, mapWith, mapHeight, tileSize, spritesheet) {
  const response = await fetch(vsl0_map);
  const data = await response.json();
  const rules = data.defs.layers[0].autoRuleGroups;
  const autoLayerTiles = generateAutoLayerTiles(intGridCsv, rules, mapWith, mapHeight, tileSize, spritesheet);
  return autoLayerTiles;
}

export class AutoMap extends LdtkResource {
  constructor(resource, options) {
    super(resource, options);
  }
  async retile() {
    const tilemap = this.getIntGridLayers()[0].tilemap;
    const tileset = this.getIntGridLayers()[0].tileset;
    window.tileset = tileset
    const w = tilemap.columns;
    const h = tilemap.rows;
    const map = new Map.IceyMaze(h, w, 1);
    const intGridCsv = []
    function pushTile(x, y, solid) {
      tilemap.tiles[y + x * w].solid = solid;
      intGridCsv.push(solid ? 1 : 0);
    }
    map.create(pushTile);

    const ldtkLayer = this.getIntGridLayers()[0].ldtkLayer;

    console.log(w, h, intGridCsv.length)
    const origIntGridCsv = ldtkLayer.intGridCsv;

    const autoLayerTiles = await calcAutoLayer(intGridCsv, tilemap.columns, tilemap.rows, tilemap.tileWidth, tileset.spritesheet);
    console.log(autoLayerTiles)
    
    // Clear previous tiles
    tilemap.tiles.forEach((tile) => {
      tile.clearGraphics();
    });

    // Autotile from ldtk-plugin code
    if (ldtkLayer.__tilesetDefUid) {
      const tileset = this.tilesets.get(ldtkLayer.__tilesetDefUid);
      for (let i = 0; i < autoLayerTiles.length; i++) {
        const tile = autoLayerTiles[i];
        const xCoord = Math.floor(tile.px[0] / ldtkLayer.__gridSize);
        const yCoord = Math.floor(tile.px[1] / ldtkLayer.__gridSize);
        const exTile = tilemap.getTile(xCoord, yCoord);
        if (exTile && tileset) {
          const tsxCoord = Math.floor(
            (tile.src[0] - (tileset.ldtkTileset.padding ?? 0)) /
              (tileset.ldtkTileset.tileGridSize +
                (tileset.ldtkTileset.spacing ?? 0))
          );
          const tsyCoord = Math.floor(
            (tile.src[1] - (tileset.ldtkTileset.padding ?? 0)) /
              (tileset.ldtkTileset.tileGridSize +
                (tileset.ldtkTileset.spacing ?? 0))
          );
          // Bit 0 toggles x flip
          // Bit 1 toggles 1 flip
          // Examples: f=0 (no flip), f=1 (X flip only), f=2 (Y flip only), f=3 (both flips)
          const flipHorizontal = !!(tile.f & 0b01);
          const flipVertical = !!(tile.f & 0b10);
          console.log(tsxCoord, tsyCoord)
          let sprite = tileset.spritesheet.getSprite(tsxCoord, tsyCoord);
          if (flipHorizontal || flipVertical) {
            sprite = sprite.clone();
            sprite.flipHorizontal = flipHorizontal;
            sprite.flipVertical = flipVertical;
          }
          if (sprite) {
            exTile.addGraphic(sprite);
          } else {
            console.error(
              "Could not find sprite in LDtk spritesheet at",
              tsxCoord,
              tsyCoord
            );
          }
        }
      }
    }
  }

}
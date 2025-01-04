export function generateAutoLayerTiles(
  intGridCsv,
  autoRuleGroups,
  gridWidth,
  gridHeight,
  tileSize,
  spritesheet
) {
  const autoLayerTiles = [];

  // Obtener el valor de una celda en intGridCsv con manejo de límites
  function getCell(x, y) {
    if (x < 0 || x >= gridWidth || y < 0 || y >= gridHeight) {
      return 1; // Valor por defecto para celdas fuera de los límites
    }
    return intGridCsv[y * gridWidth + x];
  }

  // Iterar sobre cada celda de la cuadrícula
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {

      // Aplicar reglas de auto-tileado
      for (const ruleGroup of autoRuleGroups) {
        if (!ruleGroup.active) continue;

        for (const rule of ruleGroup.rules) {
          if (!rule.active) continue;

          // Verificar si la regla coincide con el patrón en la posición actual
          let match = true;

          let _pattern = [];
          let _rulepat = [];
          for (let py = 0; py < rule.size; py++) {
            for (let px = 0; px < rule.size; px++) {
              const patternValue = rule.pattern[py * rule.size + px];
              const neighborValue = getCell(
                x + (px - Math.floor(rule.size / 2)),
                y + py - Math.floor(rule.size / 2)
              );
              _pattern.push(neighborValue);
              _rulepat.push(patternValue);
              if (
                (patternValue == -1 && neighborValue == 1) ||
                (patternValue == 1 && neighborValue == 0)
              ) {
                match = false;
                break;
              }
            }
            if (!match) break;
          }
          // for DEBUG
          // if (match) {
          //   console.log("--- ", x, y, " tile ", rule.tileRectsIds[0][0]);
          //   console.table({
          //     orig: rule.pattern,
          //     evaluated: _rulepat,
          //     rpat: _pattern,
          //   });
          // }

          if (match) {
            // TODO: Seleccionar un tile aleatorio si hay varias opciones
            const tileRectId = rule.tileRectsIds[0]; // Suponiendo una selección simple

            // Calcular posición en píxeles
            const px = x * tileSize;
            const py = y * tileSize;

            autoLayerTiles.push({
              px: [px, py],
              src: [
                spritesheet.sprites[tileRectId].sourceView.x,
                spritesheet.sprites[tileRectId].sourceView.y,
              ],
              f: 0,
              t: tileRectId,
              d: [x, y],
              a: 1, // Alpha
            });

            // Salir del loop si se aplicó una regla
            break;
          }
        }
      }
    }
  }

  return autoLayerTiles;
}

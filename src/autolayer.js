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
        return 0; // Valor por defecto para celdas fuera de los límites
      }
      return intGridCsv[y * gridWidth + x];
    }
  
    // Iterar sobre cada celda de la cuadrícula
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        const cellValue = getCell(x, y);
  
        // Aplicar reglas de auto-tileado
        for (const ruleGroup of autoRuleGroups) {
          if (!ruleGroup.active) continue;
  
          for (const rule of ruleGroup.rules) {
            if (!rule.active) continue;
  
            // Verificar si la regla coincide con el patrón en la posición actual
            let match = true;
  
            for (let py = 0; py < rule.size; py++) {
              for (let px = 0; px < rule.size; px++) {
                const patternValue = rule.pattern[px * rule.size + py];
                const neighborValue = getCell(x + px - Math.floor(rule.size / 2), y + py - Math.floor(rule.size / 2));
  
                if (patternValue !== -1 && patternValue !== neighborValue) {
                  match = false;
                  break;
                }
              }
              if (!match) break;
            }
  
            if (match) {
              // Seleccionar un tile aleatorio si hay varias opciones
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



///// DRAGONS BEYOND HERE (experiments with GPT and autolayers are underway)

export function generateAutoLayerTiles2(
  intGridCsv,
  autoRuleGroups,
  gridWidth,
  gridHeight,
  tileSize,
  spritesheet
) {
  const autoLayerTiles = [];

  // Función para obtener el valor de una celda en intGridCsv con manejo de límites
  function getCell(x, y) {
    if (x < 0 || x >= gridWidth || y < 0 || y >= gridHeight) {
      return 0; // Valor por defecto para celdas fuera de los límites
    }
    return intGridCsv[y * gridWidth + x];
  }

  // Iterar sobre cada celda de la cuadrícula
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      const cellValue = getCell(x, y);

      // Aplicar reglas de auto-tileado
      for (const ruleGroup of autoRuleGroups) {
        if (!ruleGroup.active) continue;

        for (const rule of ruleGroup.rules) {
          if (!rule.active) continue;

          // Verificar si la regla coincide con el patrón en la posición actual
          let match = true;
          for (let py = 0; py < rule.size; py++) {
            for (let px = 0; px < rule.size; px++) {
              const patternValue = rule.pattern[py * rule.size + px];
              const neighborValue = getCell(x + px - 1, y + py - 1); // Ajustar posición para el patrón
              if (patternValue !== -1 && patternValue !== neighborValue) {
                match = false;
                break;
              }
            }
            if (!match) break;
          }

          if (match) {
            // Seleccionar un tileRectId basado en la regla
            const tileRectId = rule.tileRectsIds[0]; // Suponiendo una selección simple

            // Calcular la posición en píxeles
            const px = x * tileSize;
            const py = y * tileSize;

            // Agregar el tile al autoLayerTiles
            autoLayerTiles.push({
              px: [px, py],
              src: [
                spritesheet.sprites[tileRectId].sourceView.x,
                spritesheet.sprites[tileRectId].sourceView.y,
              ],
              f: 0,
              t: tileRectId,
              d: [x, y],
              a: 1,
            });

            if (rule.breakOnMatch) break;
          }
        }
      }
    }
  }

  return autoLayerTiles;
}

export function OLD_generateAutoLayerTiles(
  intGridCsv,
  rules,
  mapWidth,
  tileSize,
  spritesheet
) {
  const autoLayerTiles = [];

  const getGridValue = (x, y) => {
    if (
      x < 0 ||
      y < 0 ||
      x >= mapWidth ||
      y >= Math.floor(intGridCsv.length / mapWidth)
    ) {
      return -1; // Valor fuera de los límites
    }
    return intGridCsv[y * mapWidth + x];
  };

  rules.reverse().forEach((rule) => {
    const { pattern, tileRectsIds, size } = rule;

    for (let y = 0; y < intGridCsv.length / mapWidth; y++) {
      for (let x = 0; x < mapWidth; x++) {
        let matches = true;

        for (let py = 0; py < size; py++) {
          for (let px = 0; px < size; px++) {
            const localX = x + px - Math.floor(size / 2);
            const localY = y + py - Math.floor(size / 2);
            const expected = pattern[py * size + px];
            const actual = getGridValue(localX, localY);

            if (expected !== -1 && expected !== actual) {
              matches = false;
              break;
            }
          }
          if (!matches) break;
        }

        if (matches) {
          let t = tileRectsIds[0][0];
          autoLayerTiles.push({
            px: [x * tileSize, y * tileSize],
            src: [tileRectsIds[0][0], tileRectsIds[0][1]],
            src: [
              spritesheet.sprites[t].sourceView.x,
              spritesheet.sprites[t].sourceView.y,
            ],
            f: 0,
            t: t,
            d: [x, y],
            a: 1,
          });
        }
      }
    }
  });

  return autoLayerTiles;
}

function generateAutoLayerTiles_OLD(
  intGridCsv,
  rules,
  mapWidth,
  tileSize,
  spritesheet
) {
  const autoLayerTiles = [];

  const getGridValue = (x, y) => {
    if (
      x < 0 ||
      y < 0 ||
      x >= mapWidth ||
      y >= Math.floor(intGridCsv.length / mapWidth)
    ) {
      return -1;
    }
    return intGridCsv[y * mapWidth + x];
  };

  rules.forEach((rule) => {
    const { pattern, tileRectsIds, size } = rule;

    for (let y = 0; y < intGridCsv.length / mapWidth; y++) {
      for (let x = 0; x < mapWidth; x++) {
        let matches = true;

        for (let py = 0; py < size; py++) {
          for (let px = 0; px < size; px++) {
            const localX = x + px - Math.floor(size / 2);
            const localY = y + py - Math.floor(size / 2);
            const expected = pattern[py * size + px];
            const actual = getGridValue(localX, localY);

            if (expected !== -1 && expected !== actual) {
              matches = false;
              break;
            }
          }
          if (!matches) break;
        }

        if (matches) {
          let t = tileRectsIds[0][0];
          autoLayerTiles.push({
            px: [x * tileSize, y * tileSize],
            src: [
              spritesheet.sprites[t].sourceView.x,
              spritesheet.sprites[t].sourceView.y,
            ],
            f: 0,
            t: t,
            d: [x, y],
            a: 1,
          });
        }
      }
    }
  });

  return autoLayerTiles;
}

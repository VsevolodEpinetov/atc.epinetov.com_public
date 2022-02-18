export function colorForSpeed (speed) {
  var color = "success";
  if (speed >= 900) color = "primary";
  else if (speed < 750) {
    if (speed >= 350) color = "warning";
    else color = "danger";
  }
  return color;
}

export function colorForCeiling (ceiling) {
  var color = "success";
  if (ceiling >= 480) color = "primary";
  else if (ceiling < 400) {
    if (ceiling >= 300) color = "warning";
    else color = "danger";
  }
  return color;
}
  
                    // 0    1    2    3    4    5    6    7    8    9    10
const speedRakings = [150, 250, 350, 450, 550, 650, 750, 850, 900, 950, 1000]; // kmh
const ceilingRakings = [150, 200, 250, 300, 350, 380, 410, 440, 480, 500]; // FL
  
export function rankSpeed (aircraftSpeed) {
  var rank;
  speedRakings.forEach((speed, id) => {
    if (aircraftSpeed >= speed) rank = id;
  })
  return {'10': rank, '100': rank * 10};
}

export function rankCeiling (aircraftCeiling) {
  var rank;
  ceilingRakings.forEach((ceiling, id) => {
    if (aircraftCeiling >= ceiling) rank = id;
  })
  return {'10': rank, '100': rank * 10};
}

export function getWeightStats (aircraftWeight) {
  var weight = {color: "info", rus: "Лёгкий"}
  if (aircraftWeight > 7000) weight = {color: "success", rus: "Средний"}
  if (aircraftWeight > 136000) weight = {color: "danger", rus: "Тяжёлый"}
  if (aircraftWeight > 550000) weight = {color: "primary", rus: "Сверхтяжёлый"}
  
  return weight;
}

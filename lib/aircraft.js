import fs from 'fs';
import path from 'path';

const aircraftDirectory = path.join(process.cwd(), 'data/aircraft')

export function getAllAircraftData() {
  const allAircraft = fs.readdirSync(aircraftDirectory)

  const allAircraftData = allAircraft.map(aircraftName => {
    const aircraftRawData = fs.readFileSync(`${aircraftDirectory}/${aircraftName}/info.json`, 'utf8')
    const aircraftInfo = JSON.parse(aircraftRawData);

    return {
      aircraftName,
      aircraftInfo
    }
  })

  return allAircraftData;
}
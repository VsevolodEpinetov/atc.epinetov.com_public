import fs from 'fs';
import path from 'path';

const dataDirectory = path.join(process.cwd(), 'data')

export function getAllAircraftTestData() {
  const data = fs.readFileSync(`${dataDirectory}/tests/aircraft.json`);
  return JSON.parse(data);
}

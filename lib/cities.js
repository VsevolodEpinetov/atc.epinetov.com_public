import fs from 'fs';
import path from 'path';

const dataDirectory = path.join(process.cwd(), 'data')

export function getAllCitiesTestData() {
  const data = fs.readFileSync(`${dataDirectory}/cities.json`);
  return JSON.parse(data);
}

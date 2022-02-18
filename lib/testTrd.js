import fs from 'fs';
import path from 'path';

const dataDirectory = path.join(process.cwd(), 'data')

export function getAllTrdTestData() {
  const data = fs.readFileSync(`${dataDirectory}/tests/trd.json`);
  return JSON.parse(data);
}

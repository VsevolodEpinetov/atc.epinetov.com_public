import fs from 'fs';
import path from 'path';

const dataDirectory = path.join(process.cwd(), 'data')

export function getAllTrdData() {
  const data = fs.readFileSync(`${dataDirectory}/trd.json`);
  return JSON.parse(data);
}

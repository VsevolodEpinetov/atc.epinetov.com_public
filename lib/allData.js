import fs from 'fs';
import path from 'path';

const cacheDirectory = path.join(process.cwd(), 'data/cache')

export function getAllData() {
  const data = fs.readFileSync(`${cacheDirectory}/data.json`);
  console.log(data);
  return JSON.parse(data);
}
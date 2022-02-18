import fs from 'fs';
import path from 'path';

const aipDirectory = path.join(process.cwd(), 'data')

export function getAllAIPData() {
  const data = fs.readFileSync(`${aipDirectory}/aip.json`);
  const aipList = JSON.parse(data);
  let allAIPData = [];
  let availableAIPList = [];
  let possibleAIPTypes = ["full", "STAR", "SID"];

  for (const aeroportICAOCode in aipList) {
    possibleAIPTypes.forEach(type => {
      if (aipList[aeroportICAOCode].availableTypes[type]) {
        availableAIPList.push({
          type: type,
          link: `https://storage.googleapis.com/atc.epinetov.com/public/aip/${aeroportICAOCode}/${aeroportICAOCode}_${type}.pdf`
        })
      }
    })
    allAIPData.push({
      "aeroportICAOCode": aeroportICAOCode,
      "availableAIPList": availableAIPList,
      "aeroportInfo": {
        "name": aipList[aeroportICAOCode].name,
        "country": aipList[aeroportICAOCode].country
      },
      "availableAIPTypes": aipList[aeroportICAOCode].availableTypes
    })
  }

  return allAIPData;
}

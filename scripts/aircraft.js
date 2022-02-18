const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const aircraftDirectory = path.join(process.cwd(), 'data/aircraft')

const getAircraft = () => {
  let data = [];
  
  const allAircraft = fs.readdirSync(aircraftDirectory)

  allAircraft.forEach(aircraftName => {
    const aircraftRawData = fs.readFileSync(`${aircraftDirectory}/${aircraftName}/info.json`, 'utf8')
    const aircraftInfo = JSON.parse(aircraftRawData);

    let aircraftData = {
      name: aircraftInfo.name,
      specs: aircraftInfo.specs
    };
    aircraftData.name.id = aircraftName;

    data.push(aircraftData)
  })

  return data;
}


function getAllData() {
  return JSON.stringify(getAircraft())
}

try {
  fs.readdirSync('data/tests')
} catch (e) {
  fs.mkdirSync('data/tests')
}

fs.writeFile('data/tests/aircraft.json', getAllData(), function (err) {
  if (err) return console.log(err);
  console.log('Aircraft gathered');
})
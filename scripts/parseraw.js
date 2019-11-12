const fs = require('fs');

function readDir(path) {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, filenames) => {
      if (err) return reject(err);
      return resolve(filenames);
    })
  });
}

function readFilesInDir(dir, fileNames) {
  const data = {};
  for (const file of fileNames) {
    const buildingName = file.split('.')[0];
    const fileContent = fs.readFileSync(`${dir}/${file}`, 'utf-8');
    data[buildingName] = fileContent;
  }
  return data;
}

function buildingTimeToSec(timeString) {
  const [hour, min, sec] = timeString.split(':');
  return Number(sec) + Number(min) * 60 + Number(hour) * 60 * 60;
}

function parseCsvData(fileContent) {
  const buildingData = {};
  for (const building in fileContent) {
    const csvData = fileContent[building];
    const rows = csvData.split('\n');
    buildingData[building] = rows.map(row => {
      if (!row) {
        return;
      }
      const [level, wood, clay, iron, crop, buildingTime, pop, totalPop, cp] = row.split(',');
      return {
        level: Number(level),
        wood: Number(wood),
        clay: Number(clay),
        iron: Number(iron),
        crop: Number(crop),
        cp: Number(cp),
        pop: Number(pop),
        totalPop: Number(totalPop),
        buildingTimeSec: buildingTimeToSec(buildingTime),
      }
    }).filter(b => b);
  }
  return buildingData;
}

async function parseraw() {
  const fileNames = await readDir('raw');
  const fileContentContainer = await readFilesInDir('raw', fileNames);
  const dataContainer = parseCsvData(fileContentContainer);

  fs.writeFileSync('parsedBuildingData.json', JSON.stringify(dataContainer, null, 2));
}

parseraw();

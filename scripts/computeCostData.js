const fs = require('fs');
const buildingData = require('../parsedBuildingData');

const NUMBER_OF_LEVELS_TO_BUILD = 100;

function getLevelDetails(buildingDetails, name) {
  return buildingDetails.map((levelDetail, index) => {
    const levelCost = levelDetail.wood + levelDetail.clay + levelDetail.iron + levelDetail.crop;
    const cpGain = index ? levelDetail.cp - buildingDetails[index - 1].cp : levelDetail.cp;
    const costPerCpGain = cpGain ? levelCost / cpGain : 9999999999999;

    return {
      cpGain,
      wood: levelDetail.wood,
      clay: levelDetail.clay,
      iron: levelDetail.iron,
      crop: levelDetail.crop,
      levelCost,
      costPerCpGain,
      name,
      level: levelDetail.level,
    };
  });
}

function sumValue(arrayToSum, propToSum) {
  return arrayToSum.reduce((sum, current) => sum + current[propToSum], 0);
}

function writeTotalDataToFileHumanReadable(data) {
  let stringData = '';
  data.forEach(d => {
    stringData += `${d.name} lvl ${d.level}: You gain ${d.cpGain} for ${d.levelCost}. Rate: ${d.costPerCpGain}\n`;
  });

  fs.writeFileSync('humanReadableList', stringData);
}

function optimize(n) {
  const allBuildIngCpData = []
  for (const building in buildingData) {
    const buildingDetails = buildingData[building];
    const cpCosts = getLevelDetails(buildingDetails, building);
    allBuildIngCpData.push(...cpCosts);
  }
  allBuildIngCpData.sort((a, b) => a.costPerCpGain - b.costPerCpGain);
  fs.writeFileSync('sortedCostData.json', JSON.stringify(allBuildIngCpData, null, 2));

  const targetLevels = allBuildIngCpData.slice(0, n);
  console.log('Best buildings to build:');
  targetLevels.forEach(details => {
    console.log(`${details.name} lvl ${details.level}: You gain ${details.cpGain} for ${details.levelCost}. Rate: ${details.costPerCpGain}`);
  });
  console.log(`Total cp: ${sumValue(targetLevels, 'cpGain')}`);
  console.log(`Total cost: ${sumValue(targetLevels, 'levelCost')}`);

  writeTotalDataToFileHumanReadable(allBuildIngCpData);
}

optimize(NUMBER_OF_LEVELS_TO_BUILD);

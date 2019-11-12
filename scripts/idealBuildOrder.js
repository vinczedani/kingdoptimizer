const fs = require('fs');
const costData = require('../sortedCostData');
const requirements = require('../requirements');

const IS_CAPITAL = false;

const capitalBuildings = ['palace', 'stonemason'];

const built = [];
const buildOrder = [];

function getCode(building, offset = 0) {
  return `${building.name}:${building.level - offset}`;
}

function uniqueBuildings(buildings) {
  const map = new Map();
  const result = [];
  for (const building of buildings) {
    if(!map.has(getCode(building))) {
      map.set(getCode(building), true);
      result.push(building);
    }
  }
  return result;
}

function findMissingRequirements(building) {
  const required = [...requirements[building.name]];
  if (building.level > 1) {
    required.push(getCode(building, 1));
  }
  const missingCodes = required.filter((requiredBuilding) => !built.includes(requiredBuilding));
  const missingBuildings = missingCodes.reduce((acc, missingBuildingCode) => {
    const [buildingName, level] = missingBuildingCode.split(':');
    const requiredBuilding = costData.find(buildingData => buildingData.name == buildingName && buildingData.level == level);
    const missingReq = findMissingRequirements(requiredBuilding);

    acc.push(requiredBuilding, ...missingReq);
    return acc;
  }, []);

  return uniqueBuildings(missingBuildings);
}

function forceBuild(building) {
  // building is already up as a requirement
  if (built.includes(getCode(building))) {
    return;
  }
  const missing = findMissingRequirements(building);

  if (missing.length === 0) {
    buildOrder.push(building);
    built.push(getCode(building));
  } else {
    missing.map(forceBuild);
    forceBuild(building);
  }
}

function buildBuilding(building, isCapital) {
  // dont build capital buildings if village is not capital
  if (!isCapital && capitalBuildings.includes(building.name)) {
    return;
  }
  // building is already up as a requirement
  if (built.includes(getCode(building))) {
    return;
  }
  const missing = findMissingRequirements(building);

  if (missing.length === 0) {
    buildOrder.push(building);
    built.push(getCode(building));
  } else {
    if (!building.requirementsAdded) {
      const requirementCostSum = missing.reduce((sum, required) => sum + required.levelCost, 0);
      const requirementCPSum = missing.reduce((sum, required) => sum + required.cpGain, 0);
      building.levelCostWithRequirements = building.levelCost + requirementCostSum;
      building.cpGainWithRequirements = building.cpGain + requirementCPSum;
      building.costPerCpGainWithRequirements = building.levelCostWithRequirements / building.cpGainWithRequirements;
      building.requirementCount = missing.length;
      building.requirementsAdded = true;
    }

    if (building.costPerCpGainWithRequirements < (costData[0].costPerCpGainWithRequirements || costData[0].costPerCpGain)) {
      forceBuild(building);
    } else {
      costData.push(building);
      costData.sort((a, b) => {
        return (a.costPerCpGainWithRequirements || a.costPerCpGain) - (b.costPerCpGainWithRequirements ||b.costPerCpGain);
      });
    }
  }
}

function saveBuildOrder() {
  const buildOrderPretty = buildOrder.map(b => {
    let string = `${b.name} lvl${b.level}: You gain ${b.cpGain}cp for ${b.levelCost} res. Res/cp: ${b.costPerCpGain}\n`;
    if (b.requirementsAdded) {
      string += `It has ${b.requirementCount} required building levels (listed above).\nCombined cost: ${b.levelCostWithRequirements} adding ${b.cpGainWithRequirements} cp overall (avg: ${b.costPerCpGainWithRequirements})\n`;
    }
    return string;
  });
  fs.writeFileSync('buildOrderPretty', buildOrderPretty.join('\n'));
  fs.writeFileSync('buildOrder.json', JSON.stringify(buildOrder, null, 2));
}

async function computeIdealBuildOrder(isCapital) {
  while (costData.length > 0) {
    const nextBestBuilding = costData.shift();
    buildBuilding(nextBestBuilding, isCapital);
  }
  saveBuildOrder();
}

computeIdealBuildOrder(IS_CAPITAL);

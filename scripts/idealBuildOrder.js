const fs = require('fs');
const costData = require('../sortedCostData');
const requirements = require('../requirements');

const IS_CAPITAL = false;

const capitalBuildings = ['palace', 'stonemason'];

const built = [];
const buildOrder = [];

function debugWait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

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

function updateDependencies(building) {
  costData.map(buildingData => {
    if (!buildingData.requirementsAdded) {
      return;
    }
    const depIndex = buildingData.missing.findIndex(bd => {
      return bd.name === building.name && bd.level === building.level;
    });
    if (depIndex === -1) {
      return;
    }
    buildingData.missing.splice(depIndex, 1);
    const requirementCostSum = buildingData.missing.reduce((sum, required) => sum + required.levelCost, 0);
    const requirementCPSum = buildingData.missing.reduce((sum, required) => sum + required.cpGain, 0);
    buildingData.levelCostWithRequirements = buildingData.levelCost + requirementCostSum;
    buildingData.cpGainWithRequirements = buildingData.cpGain + requirementCPSum;
    buildingData.costPerCpGainWithRequirements = buildingData.levelCostWithRequirements / buildingData.cpGainWithRequirements;
    buildingData.requirementCount = buildingData.missing.length;
  });
  costData.sort((a, b) => {
    return (a.costPerCpGainWithRequirements || a.costPerCpGain) - (b.costPerCpGainWithRequirements ||b.costPerCpGain);
  });
}

function forceBuild(building, target) {
  // building is already up as a requirement
  if (built.includes(getCode(building))) {
    return;
  }
  // target is not defined at root building, but defined later when force building required levels
  if (!target) {
    newTarget = getCode(building);
  }
  const missing = findMissingRequirements(building);

  if (missing.length === 0) {
    if (target && target !== getCode(building)) {
      building.target = target;
    }
    updateDependencies(building);
    buildOrder.push(building);
    built.push(getCode(building));
  } else {
    missing.forEach(missingBuilding => forceBuild(missingBuilding, target || newTarget));
    forceBuild(building, target || newTarget);
  }
}

function clearBuilding(building) {
  // the building was previously listed as first, but with requirements, it was not good enough
  // after the new sort, the building was not first anymore, now we got to it first again, but there
  // are no longer missing levels
  delete building.levelCostWithRequirements;
  delete building.cpGainWithRequirements;
  delete building.costPerCpGainWithRequirements;
  delete building.requirementCount;
  delete building.missing;
  delete building.requirementsAdded;
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
    clearBuilding(building);
    updateDependencies(building);
    buildOrder.push(building);
    built.push(getCode(building));
  } else {
    const requirementCostSum = missing.reduce((sum, required) => sum + required.levelCost, 0);
    const requirementCPSum = missing.reduce((sum, required) => sum + required.cpGain, 0);
    building.levelCostWithRequirements = building.levelCost + requirementCostSum;
    building.cpGainWithRequirements = building.cpGain + requirementCPSum;
    building.costPerCpGainWithRequirements = building.levelCostWithRequirements / building.cpGainWithRequirements;
    building.requirementCount = missing.length;
    building.missing = missing;
    building.requirementsAdded = true;

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
    if (b.target) {
      string += `Required for ${b.target}\n`;
    }
    if (b.requirementsAdded && b.requirementCount > 0) {
      string += `It has ${b.requirementCount} required building levels (listed above) ${b.missing.map(m => getCode(m)).join(', ')}.
Combined cost: ${b.levelCostWithRequirements} adding ${b.cpGainWithRequirements} cp overall (avg: ${b.costPerCpGainWithRequirements})\n`;
    }
    return string;
  });
  fs.writeFileSync('buildOrderPretty', buildOrderPretty.join('\n'));
  fs.writeFileSync('buildOrder.json', JSON.stringify(buildOrder, null, 2));
}

function computeIdealBuildOrder(isCapital) {
  while (costData.length > 0) {
    const nextBestBuilding = costData.shift();
    buildBuilding(nextBestBuilding, isCapital);
  }
  saveBuildOrder();
}

computeIdealBuildOrder(IS_CAPITAL);

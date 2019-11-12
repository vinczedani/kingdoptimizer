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

function findMissingRequirements(building) {
  const required = [...requirements[building.name]];
  if (building.level > 1) {
    required.push(getCode(building, 1));
  }
  return required.filter((requiredBuilding) => !built.includes(requiredBuilding));
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
    missing.map(missingBuildingCode => {
      const [buildingName, level] = missingBuildingCode.split(':');
      const requiredBuilding = costData.find(buildingData => buildingData.name == buildingName && buildingData.level == level);
      buildBuilding(requiredBuilding);
    });
    buildBuilding(building);
  }
}

function saveBuildOrder() {
  const buildOrderPretty = buildOrder.map(b => {
    return `${b.name} lvl${b.level}: You gain ${b.cpGain} for ${b.levelCost}. Rate: ${b.costPerCpGain}`;
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

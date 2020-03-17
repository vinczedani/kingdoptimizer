import buildOrder from '../../buildOrder';

const tribeRestrictions = {
  teuton: ["horsedrinkingthrough", "citywall", "trapper", "palisade"],
  roman: ["brewery", "earthwall", "trapper", "palisade"],
  gaul: ["horsedrinkingthrough", "citywall", "brewery", "earthwall"],
}

const capitalBuildings = ['palace', 'stonemason'];
const nonCapitalBuildings = ['residence'];

export default function getRecommendations(doneBuildings, isCapital, tribe) {
  let buildOrderForTribe = buildOrder.filter(nextBuilding => !tribeRestrictions[tribe].includes(nextBuilding.name));
  let buildOrderForVillage;
  if (isCapital) {
    buildOrderForVillage = buildOrderForTribe.filter(nextBuilding => !nonCapitalBuildings.includes(nextBuilding.name));
  } else {
    buildOrderForVillage = buildOrderForTribe.filter(nextBuilding => !capitalBuildings.includes(nextBuilding.name));
  }
  return buildOrderForVillage.filter((nextBuilding) => {
    const buildingAlreadyBuilt = doneBuildings.find(done => {
      return nextBuilding.name === done.name && nextBuilding.level <= done.level;
    });

    return !buildingAlreadyBuilt;
  });
}

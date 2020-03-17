const tribeRestrictions = {
  teuton: ["horsedrinkingthrough", "citywall", "trapper", "palisade"],
  roman: ["brewery", "earthwall", "trapper", "palisade"],
  gaul: ["horsedrinkingthrough", "citywall", "brewery", "earthwall"],
}

const capitalBuildings = ['palace', 'stonemason'];
const nonCapitalBuildings = ['residence'];

export function filterBuildings(buildings, isCapital, tribe){
  const buildOrderForTribe = buildings.filter(nextBuilding => !tribeRestrictions[tribe].includes(nextBuilding.name));
  let buildOrderForVillage;
  if (isCapital) {
    buildOrderForVillage = buildOrderForTribe.filter(nextBuilding => !nonCapitalBuildings.includes(nextBuilding.name));
  } else {
    buildOrderForVillage = buildOrderForTribe.filter(nextBuilding => !capitalBuildings.includes(nextBuilding.name));
  }

  return buildOrderForVillage;
}

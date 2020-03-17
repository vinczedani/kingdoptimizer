import buildOrder from '../../buildOrder';
import {
  filterBuildings,
} from '../consts/limitations';

export default function getRecommendations(doneBuildings, isCapital, tribe) {
  const buildOrderForVillage = filterBuildings(buildOrder, isCapital, tribe);
  return buildOrderForVillage.filter((nextBuilding) => {
    const buildingAlreadyBuilt = doneBuildings.find(done => {
      return nextBuilding.name === done.name && nextBuilding.level <= done.level;
    });

    return !buildingAlreadyBuilt;
  });
}

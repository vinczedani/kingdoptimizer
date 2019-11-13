import buildOrder from '../../buildOrder';

export default function getRecommendations(doneBuildings) {
  return buildOrder.filter((nextBuilding) => {
    const buildingAlreadyBuilt = doneBuildings.find(done => {
      return nextBuilding.name === done.name && nextBuilding.level <= done.level;
    });

    return !buildingAlreadyBuilt;
  });
}

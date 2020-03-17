/* eslint-disable no-console */
const state = {
  villages: [{ isCapital: true, id: 1, name: 'Demo village', buildings: [{ id: 1, name: 'mainbuilding', level: 1 }] }],
  activeVillageId: 1,
};

const getters = {
  getVillages(state) {
    const villages = JSON.parse(JSON.stringify(state.villages));
    const activeVillage = villages.find(v => v.id === state.activeVillageId);
    activeVillage.isActive = true;
    return villages;
  },
  getActiveVillage(state) {
    const activeVillage = state.villages.find(v => v.id === state.activeVillageId);

    return JSON.parse(JSON.stringify(activeVillage));
  }
};

const actions = {
  addVillage({ commit }) {
    const newId = Date.now();
    commit('createNewVillage', { id: newId, name: 'New village', buildings: [
      { id: 1, name: 'mainbuilding', level: 1 },
    ]});
    commit('setActiveVillage', newId);
  }
};

const mutations = {
  setActiveVillage(state, villageId) {
    state.activeVillageId = villageId;
  },
  createNewVillage(state, newVillage) {
    state.villages.push(newVillage);
  },
  saveVillage(state, village) {
    const changedVillage = state.villages.find(v => v.id === village.id);
    changedVillage.name = village.name;
  },
  createNewBuilding(state) {
    const activeVillage = state.villages.find(v => v.id === state.activeVillageId);
    activeVillage.buildings.push({ id: Date.now(), name: 'mainbuilding', level: 1 });
  },
  setBuildingLevel(state, building) {
    const activeVillage = state.villages.find(v => v.id === state.activeVillageId);
    const changedBuilding = activeVillage.buildings.find(b => b.id === building.id);
    changedBuilding.level = building.level;
    changedBuilding.name = building.name;
  },
  buildBuilding(state, newBuilding) {
    const activeVillage = state.villages.find(v => v.id === state.activeVillageId);
    const changedBuilding = activeVillage.buildings.find(b => (b.name === newBuilding.name) && (b.level < newBuilding.level));
    if (changedBuilding) {
      changedBuilding.level = newBuilding.level;
    } else {
      activeVillage.buildings.push({ id: Date.now(), name: newBuilding.name, level: newBuilding.level })
    }
  },
  deleteVillage(state, villageId) {
    const index = state.villages.findIndex(v => v.id === villageId);

    if (index > -1) {
      if (villageId === state.activeVillageId) {
        state.activeVillageId = state.villages[0] && state.villages[0].id || 0
      }
      state.villages.splice(index, 1);
    }
  },
  deleteBuilding(state, buildingId) {
    const activeVillage = state.villages.find(v => v.id === state.activeVillageId);
    const index = activeVillage.buildings.findIndex(b => b.id === buildingId);

    if (index > -1) {
      activeVillage.buildings.splice(index, 1);
    }
  },
  sortBuildings(state) {
    const activeVillage = state.villages.find(v => v.id === state.activeVillageId);
    activeVillage.buildings.sort((a, b) => (a.name > b.name) ? 1 : -1);
  },
  sortVillages(state) {
    state.villages.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
  },
  markVillageAsCapital(state, villageId) {
    const oldCapital = state.villages.find(v => v.isCapital);
    if (oldCapital) {
      oldCapital.isCapital = false;
    }

    const newCapital = state.villages.find(v => v.id === villageId);
    newCapital.isCapital = true;
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
};

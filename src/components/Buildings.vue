<template>
  <div class="buildings">
    Buildings
    <div
      v-for="building in village.buildings"
      :key="building.id">
      <select v-model="building.name" @change="buildingChanged(building)">
        <option :value="ab.name" v-for="ab in availableBuildings" :key="ab.name">{{ ab.name }}</option>
      </select>
      <select v-model="building.level" @change="buildingLevelChanged(building)">
        <option v-for="n in 20" :value="n" :key="n">{{ n }}</option>
      </select>
      <span class="clickable" @click="deleteBuilding(building.id)"></span>
    </div>
    <button @click="addBuilding">Add new building</button>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

import availableBuildings from '../consts/buildings';

export default {
  data() {
    return { availableBuildings };
  },
  computed: {
    ...mapGetters({
      village: 'getActiveVillage'
    })
  },
  methods: {
    ...mapMutations({
      buildingChanged: 'setBuildingLevel',
      addBuilding: 'createNewBuilding',
      deleteBuilding: 'deleteBuilding',
    })
  }
}
</script>

<style lang="scss">
.buildings {
  width: 30%;
}
</style>

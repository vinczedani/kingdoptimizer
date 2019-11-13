<template>
  <div class="buildings">
    <h2 class="clickable" @click="sortBuildings">Buildings</h2>
    <div
      v-for="(building, i) in village.buildings"
      :key="building.id">
      <span>{{ i + 1 }}. &nbsp;</span>
      <select v-model="building.name" @change="buildingChanged(building)">
        <option :value="ab.name" v-for="ab in availableBuildings" :key="ab.name">{{ ab.name }}</option>
      </select>
      <select v-model="building.level" @change="buildingChanged(building)">
        <option v-for="n in 20" :value="n" :key="n">{{ n }}</option>
      </select>
      <span class="clickable" @click="deleteBuilding(building.id)">delete</span>
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
      sortBuildings: 'sortBuildings'
    })
  }
}
</script>

<style lang="scss">
.buildings {
  width: 30%;
}
</style>

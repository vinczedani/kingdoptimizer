<template>
  <div class="villages">
    <h2 class="clickable" @click="sortVillages">Villages</h2>
    <br/>
    <div
      class="villageItem"
      v-for="village in villages"
      :key="village.id">
        <span class="clickable" @click="setActiveVillage(village.id)">
          <input v-if="village.isActive" type="text" v-model="village.name" @change="saveVillage(village)"/>
          <span v-else style="padding: 10px;">{{ village.name }}</span>
        </span>
        <span class="clickable" @click="deleteVillage(village.id)">delete</span>
      </div>
      <button @click="addVillage">Add new village</button>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';

export default {
  computed: {
    villages() {
      const villages = JSON.parse(JSON.stringify(this.$store.state.village.villages));
      const activeVillage = villages.find(v => v.id === this.$store.state.village.activeVillageId);
      activeVillage.isActive = true;
      return villages;
    }
  },
  methods: {
    ...mapActions({
      addVillage: 'addVillage',
    }),
    ...mapMutations({
      setActiveVillage: 'setActiveVillage',
      deleteVillage: 'deleteVillage',
      saveVillage: 'saveVillage',
      sortVillages: 'sortVillages',
    }),
  }
}
</script>

<template>
  <div class="villages">
    <h2>Villages</h2>
    <div
      class="villageItem"
      v-for="village in villages"
      :key="village.id">
        <span v-if="village.isActive">*</span>
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
import { mapGetters, mapActions, mapMutations } from 'vuex';

export default {
  computed: {
    ...mapGetters({
      villages: 'getVillages',
    })
  },
  methods: {
    ...mapActions({
      addVillage: 'addVillage',
    }),
    ...mapMutations({
      setActiveVillage: 'setActiveVillage',
      deleteVillage: 'deleteVillage',
      saveVillage: 'saveVillage',
    }),
  }
}
</script>

<style lang="scss">
.villages {
  width: 20%;
}
</style>

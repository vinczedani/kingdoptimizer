<template>
  <div>
    <input type="radio" id="roman" value="roman" v-model="tribe">
    <label for="roman">Roman</label>

    <input type="radio" id="teuton" value="teuton" v-model="tribe">
    <label for="teuton">Teuton</label>

    <input type="radio" id="gaul" value="gaul" v-model="tribe">
    <label for="gaul">Gaul</label>
  </div>
</template>

<script>
export default {
  computed: {
    tribe: {
      get() {
        return this.$store.state.tribe;
      },
      set(tribe) {
        this.$store.commit("setTribe", tribe)
      }
    }
  },
}
</script>

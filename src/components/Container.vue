<template>
  <div>
    <div class="usage">
      <div style="width: 20%;">
        You can add multiple villages, they will be stored in your browser, so whenever you come back, they will be there.<br>
        You can rename the active village</div>
      <div style="width: 30%;">
        Set current building levels to get up to date recommendations.<br>
        Click the "Buildings" subititle to sort buildings alphabetically</div>
      <div style="width: 50%;">
        The recommendations are sorted based on res/cp, the first is the cheapest.<br>
        Sometimes, it's worth it to build a building with worse res/cp to be able to build a better res/cp building. When calculating res/cp on buildings with missing requirements, the app uses averages.<br>
        Click the recommendation to build it in your active village</div>
    </div>
    <div>
      <TribeSelector/>
    </div>
    <div class="container" style="padding: 20px">
      <div style="width: 33%">
        <Villages/>
      </div>
      <div style="width: 66%">
        <div style="text-align: left">
          <h1>{{ village.name }} <span v-if="village.isCapital">(capital)</span></h1>
          <button type='button' @click="markVillageAsCapital(village.id)"> Set as capital </button>
        </div>
        <div class="container">
          <Buildings/>
          <Recommendations/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import Villages from './Villages';
import Buildings from './Buildings';
import TribeSelector from './TribeSelector';
import Recommendations from './Recommendations';

export default {
  components: {
    Villages,
    Buildings,
    TribeSelector,
    Recommendations,
  },
  computed: {
    ...mapGetters({
      village: 'getActiveVillage'
    }),
  },
  methods: {
    ...mapMutations({
      markVillageAsCapital: 'markVillageAsCapital',
    }),
  }
};
</script>

<style lang="scss">
.usage {
  min-height: 60px;
  display: flex;
  & > * {
    padding: 20px;
  }
}
.container {
  display: flex;
}
</style>

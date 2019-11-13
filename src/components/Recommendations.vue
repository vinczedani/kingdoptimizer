<template>
  <div class="recommendations">
    <h2>Recommendations</h2>
    <div
      v-for="recommendedBuilding in recommendations"
      :key="recommendedBuilding.name + recommendedBuilding.level"
      class="tooltip"
      @click="buildRecommendedBuilding(recommendedBuilding)">
      <span>{{ recommendedBuilding.name }}</span>
      <span>{{ recommendedBuilding.level }}</span>
      <span class="tooltiptext">
        cpGain: {{ recommendedBuilding.cpGain }} <br/>
        wood: {{ recommendedBuilding.wood }}
        clay: {{ recommendedBuilding.clay }}
        iron: {{ recommendedBuilding.iron }}
        crop: {{ recommendedBuilding.crop }}
      </span>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import getRecommendations from '../services/recommendation'

export default {
  computed: {
    recommendations() {
      const currentBuildings = this.village.buildings;
      return getRecommendations(currentBuildings);
    },
    ...mapGetters({
      village: 'getActiveVillage',
    }),
  },
  methods: {
    ...mapMutations({
      buildRecommendedBuilding: 'buildBuilding'
    })
  }
}
</script>

<style lang="scss">
.recommendations {
  width: 50%;

  .tooltip {
    position: relative;
    display: block;
    cursor: pointer;
  }

  .tooltip .tooltiptext {
    visibility: hidden;
    background-color: #555;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;
    position: absolute;
    z-index: 1;
    bottom: 125%;
    left: 40%;
    margin-left: -60px;
    opacity: 0;
    transition: opacity 0.3s;
    padding: 1rem;
  }

  .tooltip .tooltiptext::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #555 transparent transparent transparent;
  }

  .tooltip:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
  }
}
</style>

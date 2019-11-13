<template>
  <div>
    <div class="usage">
      <div style="width: 20%;">You can add multiple villages, they will be stored in your browser, so whenever you come back, they will be there. You can rename the active village</div>
      <div style="width: 30%;">Set current building levels to get up to date recommendations. Click the "Buildings" subititle to sort buildings alphabetically</div>
      <div style="width: 50%;">The recommendations are sorted based on res/cp, the first is the cheapest. Click the recommendation to build it in your active village</div>
    </div>
    <div class="container">
      <Villages/>
      <Buildings/>
      <Recommendations/>
    </div>
  </div>
</template>

<script>
import Villages from './Villages';
import Buildings from './Buildings';
import Recommendations from './Recommendations';

export default {
  components: {
    Villages,
    Buildings,
    Recommendations,
  },
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

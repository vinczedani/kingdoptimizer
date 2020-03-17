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
import TribeSelector from './TribeSelector';
import Recommendations from './Recommendations';

export default {
  components: {
    Villages,
    Buildings,
    TribeSelector,
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

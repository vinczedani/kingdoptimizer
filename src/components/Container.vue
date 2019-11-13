<template>
  <div class="container">
    <Villages/>
    <Buildings/>
    <Recommendations/>
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
.container {
  display: flex;
}
</style>

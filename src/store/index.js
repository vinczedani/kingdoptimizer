import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist'

import village from './village';

Vue.use(Vuex);
const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    village,
  },
  strict: debug,
  plugins: [vuexLocal.plugin]
})

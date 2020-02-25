import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';

Vue.use(Vuex);

const store: StoreOptions<any> = {
  state: {
    refresh: Function,
  },
  mutations: {
    setRefresh(state: any, refresh: Function) {
      state.refresh = refresh;
    },
  },
};

export default new Vuex.Store<any>(store);

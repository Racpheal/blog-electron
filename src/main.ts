import Vue from 'vue';
import MavonEditor from 'mavon-editor';
import ViewUI from 'view-design';
import App from './App.vue';
import store from './store';
import router from './router';
import 'mavon-editor/dist/css/index.css';
import 'view-design/dist/styles/iview.css';

Vue.config.productionTip = false;
Vue.use(MavonEditor);
Vue.use(ViewUI);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');

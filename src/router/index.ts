import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/views/Index.vue'),
    children: [
      {
        path: '/post/editor',
        name: 'post_editor',
        component: () => import('@/views/post/Editor.vue'),
      },
      {
        path: '/post/list',
        name: 'post_list',
        component: () => import('@/views/post/List.vue'),
      },
      {
        path: '/post/view',
        name: 'post_view',
        component: () => import('@/views/post/View.vue'),
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

export default router;

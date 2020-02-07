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
        path: '/manage/editor',
        name: 'manage_editor',
        component: () => import('@/views/manage/Editor.vue'),
      },
      {
        path: '/manage/category',
        name: 'manage_category',
        component: () => import('@/views/manage/Category.vue'),
      },
      {
        path: '/manage/list',
        name: 'manage_list',
        component: () => import('@/views/manage/List.vue'),
      },
      {
        path: '/blog/list',
        name: 'blog_list',
        component: () => import('@/views/blog/List.vue'),
      },
      {
        path: '/blog/view',
        name: 'blog_view',
        component: () => import('@/views/blog/View.vue'),
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

export default router;

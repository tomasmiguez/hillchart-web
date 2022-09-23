import { createRouter, createWebHashHistory } from 'vue-router';

import Hillchart from '@/components/Hillchart.vue';

const routes = [
  { path: '/hillchart/:id', name: 'Hillchart', component: Hillchart },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

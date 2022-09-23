import { createRouter, createWebHashHistory } from 'vue-router';

import client from '@/client'

import Hillchart from '@/components/Hillchart.vue';

async function createHillchartBeforeEnter(to, from) {
  try {
  const createHillchartRes = await client.post('/hillcharts', { name: 'TITLE (CLICK ME)' });
  await client.post('/frames', { hillchartId: createHillchartRes.data.data.id });

  return { path: `/hillchart/${createHillchartRes.data.data.id}` };
  } catch (error) {
    console.log(error);
    return false;
  };
};

const routes = [
  { path: '/hillchart/:id', name: 'Hillchart', component: Hillchart },
  { path: '/hillchart', name: 'CreateHillchart', beforeEnter: createHillchartBeforeEnter }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

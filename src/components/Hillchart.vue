<script setup>
import { onMounted } from 'vue';

import 'hill-chart/dist/styles.css';

import HillChart from 'hill-chart';

const data = [
  {
    id: '1',
    color: 'red',
    description: 'Late af task',
    size: 10,
    x: 12.069770990416055,
    link: '/fired.html',
  },

  {
    id: '3',
    color: 'yellow',
    description: 'Gettin there',
    size: 10,
    x: 55.11627906976744,
  },
  {
    id: '2',
    color: 'green',
    description: 'Hell yeah!',
    x: 93.48837209302326,
    size: 10,
  },
];

const config = {
  target: '.hill-chart',
  width: 700,
  height: 270,
  preview: false,
};

onMounted(() => {
  const hill = new HillChart(data, config);

  hill.on('move', (x, y) => {
    console.log(`x: ${x}`);
    console.log(`y: ${y}`);
  });

  hill.render();
});
</script>

<template>
  <svg class="hill-chart"/>
</template>

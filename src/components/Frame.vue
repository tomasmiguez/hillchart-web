<script setup>
import { onMounted, inject } from 'vue';

import 'hill-chart/dist/styles.css';
import HillChart from 'hill-chart';

const axios = inject('axios');

onMounted(async () => {
  try {
    const response = await axios.get('/hillcharts/10');
    const frame = response.data.data.frames[0];
    const scopes = response.data.data.scopes;
    const data = frame.frameScopes.map((frameScope) =>
      ({
        id: frameScope.id,
        color: scopes.find(scope => scope.id === frameScope.scopeId).color,
        description: frameScope.title,
        size: 10,
        x: frameScope.position,
      })
    );

    const config = {
      target: '.hill-chart',
      width: 700,
      height: 270,
      preview: false,
    };

    const hill = new HillChart(data, config);

    hill.render();
  } catch (error) {
    console.log(error);
  }
});
</script>

<template>
  <svg class="hill-chart"/>
</template>

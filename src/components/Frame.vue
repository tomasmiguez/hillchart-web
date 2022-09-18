<script setup>
import { onMounted, inject } from 'vue';

import 'hill-chart/dist/styles.css';
import HillChart from 'hill-chart';

const axios = inject('axios');

function persistMovement(data) {
  const body = { position: data.x };
  axios.patch(`frame-scopes/${data.id}`, body)
    .catch(error => console.log(error));
};

onMounted(async () => {
  try {
    const response = await axios.get('/hillcharts/10');
    const frame = response.data.data.frames[0];
    const scopes = response.data.data.scopes;
    const data = frame.frameScopes.map(frameScope =>
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

    hill.on('moved', persistMovement);
  } catch (error) {
    console.log(error);
  }
});
</script>

<template>
  <svg class="hill-chart"/>
</template>

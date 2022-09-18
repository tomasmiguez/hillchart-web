<script setup>
import { onMounted, inject } from 'vue';

import 'hill-chart/dist/styles.css';
import HillChart from 'hill-chart';

const axios = inject('axios');

const props = defineProps(['frame', 'scopes']);

function persistMovement(data) {
  const body = { position: data.x };
  axios.patch(`frame-scopes/${data.id}`, body)
    .catch(error => console.log(error));
};

onMounted(async () => {
  try {
    const data = props.frame.frameScopes.map(frameScope =>
      ({
        id: frameScope.id,
        color: props.scopes.find(scope => scope.id === frameScope.scopeId).color,
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

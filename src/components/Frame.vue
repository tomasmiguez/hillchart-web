<script setup>
import { onMounted, inject, watch, ref } from 'vue';

import 'hill-chart/dist/styles.css';
import HillChart from 'hill-chart';

const axios = inject('axios');

const props = defineProps(['frame', 'scopes']);

const svg = ref(null)

function persistMovement(data) {
  const body = { position: data.x };
  axios.patch(`frame-scopes/${data.id}`, body)
    .catch(error => console.log(error));
};

function renderHillchart() {
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
    target: '#hillchart',
    width: 700,
    height: 270,
    preview: false,
  };

  svg.value.innerHTML = '';

  const hill = new HillChart(data, config);

  hill.render();

  hill.on('moved', persistMovement);
};

watch(props, renderHillchart);

onMounted(() => {
  renderHillchart();
});
</script>

<template>
  <svg ref="svg" id="hillchart"/>
</template>

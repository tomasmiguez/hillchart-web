<script setup>
  import { inject, ref, computed, watch } from 'vue';

  import Frame from './Frame.vue';

  const axios = inject('axios');

  const hillchart = ref(null);
  const currentFrameId = ref(null);
  const currentFrame = ref(null);

  function getHillchart() {
    axios.get('hillcharts/10')
      .then(response => {
        hillchart.value = response.data.data;
      })
      .catch(error => console.log(error));
  };

  getHillchart();

  watch(currentFrameId, () => {
    currentFrame.value = null;
    getHillchart();
    currentFrame.value = hillchart.value.frames.find(frame => frame.id === currentFrameId.value);
  })
</script>

<template>
  <div v-if="hillchart">
    <div v-for="(frame, index) in hillchart.frames" :key="frame.id">
      <button @click="currentFrameId=frame.id">{{ index+1 }}</button>
    </div>
    <Frame v-if="currentFrame" :frame="currentFrame" :scopes="hillchart.scopes" />
  </div>
  <p v-else>LOADING...</p>
</template>

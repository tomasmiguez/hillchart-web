<script setup>
  import { inject, ref, computed, watch, onBeforeMount } from 'vue';

  import Frame from './Frame.vue';

  const axios = inject('axios');

  const hillchart = ref(null);
  const currentFrameId = ref(null);
  const currentFrame = ref(null);

  async function getHillchart() {
    try {
      const response = await axios.get('hillcharts/10')
      hillchart.value = response.data.data;
    } catch (error) {
      console.log(error);
    }
  };

  onBeforeMount(async () => {
    await getHillchart();

    currentFrame.value = hillchart.value.frames[hillchart.value.frames.length - 1];
    currentFrameId.value = currentFrame.value.id;
  });

  watch(currentFrameId, async () => {
    currentFrame.value = null;
    await getHillchart();
    currentFrame.value = hillchart.value.frames.find(frame => frame.id === currentFrameId.value);
  });
</script>

<template>
  <div v-if="hillchart">
    <div>
      <button v-for="(frame, index) in hillchart.frames" :key="frame.id" @click="currentFrameId=frame.id">{{ index+1 }}</button>
    </div>
    <Frame v-if="currentFrame" :frame="currentFrame" :scopes="hillchart.scopes" />
  </div>
  <p v-else>LOADING...</p>
</template>

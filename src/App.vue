<script setup>
  import { inject, ref, computed } from 'vue';

  import Frame from './components/Frame.vue';

  const axios = inject('axios');

  const hillchart = ref(null);
  const currentFrameId = ref(null);

  axios.get('hillcharts/10')
    .then(response => {
      hillchart.value = response.data.data;
    })
    .catch(error => console.log(error));

  const currentFrame = computed(() => {
    return hillchart.value.frames.find(frame => frame.id === currentFrameId.value);
  });
</script>

<template>
  <div v-if="hillchart">
    <div v-for="(frame, index) in hillchart.frames" :key="frame.id">
      <button @click="currentFrameId=frame.id">{{ index+1 }}</button>
    </div>
    <Frame v-if="currentFrameId" :frame="currentFrame" :scopes="hillchart.scopes" />
  </div>
  <p v-else>LOADING...</p>
</template>

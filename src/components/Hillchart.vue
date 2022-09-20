<script setup>
  import { inject, ref, computed, watch, onBeforeMount } from 'vue';

  import Frame from './Frame.vue';
  import Scopes from './Scopes.vue';

  const axios = inject('axios');

  const hillchart = ref(null);
  const currentFrameIndex = ref(null);
  const currentFrame = ref(null);

  async function getHillchart() {
    try {
      const response = await axios.get('hillcharts/10')
      hillchart.value = response.data.data;
    } catch (error) {
      console.log(error);
    }
  };

  function previousFrame() {
    if(currentFrameIndex.value > 0) {
      currentFrameIndex.value--;
      currentFrame.value = hillchart.value.frames[currentFrameIndex.value];
    }
  };

  function nextFrame() {
    if(currentFrameIndex.value < hillchart.value.frames.length - 1) {
      currentFrameIndex.value++;
      currentFrame.value = hillchart.value.frames[currentFrameIndex.value];
    }
  };

  async function newFrame() {
    try {
      const tmpFrame = currentFrame.value;
      currentFrame.value = null;
      const response = await axios.post('/frames', { hillchartId: hillchart.value.id });
      const newFrame = response.data.data;
      for(const frameScope of tmpFrame.frameScopes) {
        const body = {
          title: frameScope.title,
          position: frameScope.position,
          frameId: newFrame.id,
          scopeId: frameScope.scopeId
        }
        console.log(body);
        await axios.post('/frame-scopes', body);
      };
      await getHillchart();
      currentFrameIndex.value = hillchart.value.frames.length - 1;
    } catch (error) {
      console.log(error);
    }
  };

  onBeforeMount(async () => {
    await getHillchart();

    currentFrameIndex.value = hillchart.value.frames.length - 1;
    currentFrame.value = hillchart.value.frames[currentFrameIndex.value];
  });


  watch(currentFrameIndex, async () => {
    currentFrame.value = null;
    await getHillchart();
    currentFrame.value = hillchart.value.frames[currentFrameIndex.value];
  });
</script>

<template>
  <div :style="{'width': 'fit-content'}" v-if="hillchart">
    <h3>{{ hillchart.name }}</h3>
    <div v-if="currentFrame">
      <Frame :frame="currentFrame" :scopes="hillchart.scopes" />
      <div>
        <button :style="[currentFrameIndex === index ? {'text-decoration': 'underline', 'font-weight': 'bold'} : {}]" v-for="(frame, index) in hillchart.frames" :key="frame.id" @click="currentFrameIndex=index">{{ index+1 }}</button>
        <button :disabled="currentFrameIndex === 0" @click="previousFrame">&lt;</button>
        <button :disabled="currentFrameIndex === hillchart.frames.length - 1" @click="nextFrame">&gt;</button>
        <button @click="newFrame">+</button>
      </div>
      <Scopes :frame="currentFrame" :scopes="hillchart.scopes" />
    </div>
  </div>
  <p v-else>LOADING...</p>
</template>

<style>
h3 {
  text-align: center;
}
</style>

<script setup>
  import { inject, ref, computed, watch, onBeforeMount, provide } from 'vue';

  import Frame from './Frame.vue';
  import Scopes from './Scopes.vue';

  const axios = inject('axios');

  const scopes = ref(null);
  const frames = ref(null);
  const name = ref(null);
  const id = ref(null);
  const currentFrameIndex = ref(null);
  const currentFrame = computed(() => {
    return currentFrameIndex.value !== null ? frames.value[currentFrameIndex.value] : null;
  });

  async function getHillchart() {
    try {
      const response = await axios.get('hillcharts/10')
      const hillchart = response.data.data;
      scopes.value = hillchart.scopes;
      frames.value = hillchart.frames;
      name.value = hillchart.name;
      id.value = hillchart.id;
    } catch (error) {
      console.log(error);
    }
  };

  async function newFrame() {
    try {
      const tmpFrame = currentFrame.value;
      currentFrameIndex.value = null;
      const response = await axios.post('/frames', { hillchartId: id.value });
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
      currentFrameIndex.value = frames.value.length - 1;
    } catch (error) {
      console.log(error);
    }
  };

  onBeforeMount(async () => {
    await getHillchart();

    currentFrameIndex.value = frames.value.length - 1;
  });
</script>

<template>
  <div :style="{'width': 'fit-content'}" v-if="id">
    <h3>{{ name }}</h3>
    <template v-if="currentFrame">
      <Frame @hillchart-modified="getHillchart" :frame="currentFrame" :scopes="scopes" />
      <div>
        <button :style="[currentFrameIndex === index ? {'text-decoration': 'underline', 'font-weight': 'bold'} : {}]" v-for="(frame, index) in frames" :key="frame.id" @click="currentFrameIndex=index">{{ index+1 }}</button>
        <button :disabled="currentFrameIndex === 0" @click="currentFrameIndex--">&lt;</button>
        <button :disabled="currentFrameIndex === frames.length - 1" @click="currentFrameIndex++">&gt;</button>
        <button @click="newFrame">+</button>
      </div>
      <Scopes @hillchart-modified="getHillchart" :frame="currentFrame" :scopes="scopes" />
    </template>
  </div>
  <p v-else>LOADING...</p>
</template>

<style>
  h3 {
    text-align: center;
  }
</style>

<script setup>
  import { inject, ref, computed, watch, onBeforeMount, provide } from 'vue';
  import { useRoute } from 'vue-router'

  import Frame from './Frame.vue';
  import Scopes from './Scopes.vue';

  const axios = inject('axios');

  const route = useRoute();

  const scopes = ref(null);
  const frames = ref(null);
  const name = ref(null);
  const id = ref(null);
  const currentFrameIndex = ref(null);
  const currentFrame = computed(() => {
    return currentFrameIndex.value !== null ? frames.value[currentFrameIndex.value] : null;
  });
  const locked = ref(false);
  const lockText = computed(() => {
    return locked.value ?
      'U' : 'L';
  });

  async function getHillchart() {
    try {
      const response = await axios.get(`hillcharts/${route.params.id}`)
      const hillchart = response.data.data;
      scopes.value = hillchart.scopes;
      frames.value = hillchart.frames;
      name.value = hillchart.name;
      id.value = hillchart.id;
    } catch (error) {
      console.log(error);
    }
  };

  const editName = ref(false);

  async function newFrame() {
    try {
      const response = await axios.post('/frames', { hillchartId: id.value });
      const newFrame = response.data.data;
      for(const frameScope of currentFrame.value.frameScopes) {
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

  async function toggleEditNameAndUpdate() {
    try {
      if(editName.value) {
        await axios.patch(`/hillcharts/${id.value}`, { name: name.value });
      }

      editName.value = !editName.value;
    } catch (error) {
      console.log(error);
    }
  };

  watch(() => route.params.id, () => getHillchart());

  watch(() => currentFrameIndex.value, () => {
    if(currentFrameIndex.value === frames.value.length - 1) {
      locked.value = false;
    } else {
      locked.value = true;
    }
  });

  onBeforeMount(async () => {
    await getHillchart();

    currentFrameIndex.value = frames.value.length - 1;
  });
</script>

<template>
  <div :style="{'width': 'fit-content'}" v-if="id">
    <div style="text-align: center">
      <h3 v-if="!editName" @click="toggleEditNameAndUpdate">{{ name }}</h3>
      <input v-else v-model="name" @keyup.enter="toggleEditNameAndUpdate">
      <p v-if="currentFrame">{{ new Date(currentFrame.createdAt).toLocaleDateString() }}</p>
    </div>
    <template v-if="currentFrame">
      <Frame @hillchart-modified="getHillchart" :frame="currentFrame" :scopes="scopes" :preview="locked" />
      <div>
        <button :style="[currentFrameIndex === index ? {'text-decoration': 'underline', 'font-weight': 'bold'} : {}]" v-for="(frame, index) in frames" :key="frame.id" @click="currentFrameIndex=index">{{ index+1 }}</button>
        <button :disabled="currentFrameIndex === 0" @click="currentFrameIndex--">&lt;</button>
        <button :disabled="currentFrameIndex === frames.length - 1" @click="currentFrameIndex++">&gt;</button>
        <button @click="newFrame">+</button>
        <button @click="locked = !locked">{{ lockText }}</button>
      </div>
      <Scopes @hillchart-modified="getHillchart" :current-frame-index="currentFrameIndex" :scopes="scopes" :frames="frames" />
    </template>
  </div>
  <p v-else>LOADING...</p>
</template>

<style>
</style>

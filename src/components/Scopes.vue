<script setup>
  import { ref, inject, computed } from 'vue';

  const axios = inject('axios');

  const props = defineProps(['currentFrameIndex', 'scopes', 'frames']);

  const emit = defineEmits(['hillchartModified']);

  const currentFrame = computed(() => {
    return props.frames[props.currentFrameIndex];
  });

  function scopeById(id) {
    return props.scopes.find(scope => scope.id === id);
  }

  const newScopeTitle = ref('');

  async function newScope(e) {
    try {
      e.preventDefault();

      const createScopeBody = {
        hillchartId: currentFrame.value.hillchartId,
        color: randomHexColor()
      };
      const createScopeRes = await axios.post('/scopes', createScopeBody);

      const createFrameScopeBody = {
        title: newScopeTitle.value,
        scopeId: createScopeRes.data.data.id
      };
      await Promise.all(props.frames.slice(props.currentFrameIndex, props.frames.length).map((frame) => {
        createFrameScopeBody.frameId = frame.id;
        return axios.post('/frame-scopes', createFrameScopeBody);
      }));

      emit('hillchartModified');

      newScopeTitle.value = '';
    } catch (error) {
      console.log(error);
    }
  }

  function randomHexColor() {
    return "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
  }

  async function deleteScope(scopeId) {
    await Promise.all(props.frames.reduce((arr, frame) => {
      const frameScope = frame.frameScopes.find((frameScope) => frameScope.scopeId === scopeId);
      if(frameScope !== undefined) arr.push(axios.delete(`/frame-scopes/${frameScope.id}`));

      return arr;
    }, []));

    await axios.delete(`/scopes/${scopeId}`);

    emit('hillchartModified');
  }
</script>

<template>
  <ul>
    <li v-for='frameScope in currentFrame.frameScopes'>
      <p class="dot" :style="{ backgroundColor: scopeById(frameScope.scopeId).color }"></p><p style="display: inline-table; margin-left: 1em">{{ frameScope.title }}</p>
      <button @click="deleteScope(frameScope.scopeId)" style="display: inline-table; margin-left: 1em">X</button>
    </li>
    <li>
      <form id="add">
        <input v-model="newScopeTitle">
        <button :disabled="newScopeTitle===''" @click="newScope">+</button>
      </form>
    </li>
  </ul>
</template>

<style>
ul {
  list-style: none;
  padding: 0px;
  margin: 0px;
}

.dot {
  height: 15px;
  width: 15px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-table;
}
</style>

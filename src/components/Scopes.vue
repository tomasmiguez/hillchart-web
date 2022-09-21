<script setup>
  import { ref, inject } from 'vue';

  const axios = inject('axios');

  const props = defineProps(['frame', 'scopes']);

  const emit = defineEmits(['hillchartModified']);

  function scopeById(id) {
    return props.scopes.find(scope => scope.id === id);
  }

  const newScopeTitle = ref('');

  async function newScope() {
    try {
      const createScopeBody = {
        hillchartId: props.frame.hillchartId,
        color: randomHexColor()
      };
      const createScopeRes = await axios.post('/scopes', createScopeBody);

      const createFrameScopeBody = {
        title: newScopeTitle.value,
        frameId: props.frame.id,
        scopeId: createScopeRes.data.data.id
      };
      await axios.post('/frame-scopes', createFrameScopeBody);

      emit('hillchartModified');
    } catch (error) {
      console.log(error);
    }
  }

  function randomHexColor() {
    return "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
  }
</script>

<template>
  <ul>
    <li v-for='frameScope in frame.frameScopes'>
      <p class="dot" :style="{ backgroundColor: scopeById(frameScope.scopeId).color }"></p><p style="display: inline-table; margin-left: 1em">{{ frameScope.title }}</p>
    </li>
    <li>
    <input v-model="newScopeTitle"> <button :disabled="newScopeTitle===''" @click="newScope">+</button>
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
  height: 25px;
  width: 25px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-table;
}
</style>

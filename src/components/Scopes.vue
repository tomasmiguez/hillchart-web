<script setup>
  import { inject } from 'vue';

  const axios = inject('axios');

  const props = defineProps(['frame', 'scopes']);

  function scopeById(id) {
    return props.scopes.find(scope => scope.id === id);
  }
</script>

<template>
  <ul>
    <li v-for='frameScope in props.frame.frameScopes'>
      <p class="dot" :style="{ backgroundColor: scopeById(frameScope.scopeId).color }"></p><p style="display: inline-table; margin-left: 1em">{{ frameScope.title }}</p>
      </li>
    <li>
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

<script setup>
  import { inject, ref } from 'vue';

  import Frame from './components/Frame.vue';

  const axios = inject('axios');

  const hillchart = ref(null);

  axios.get('hillcharts/10')
    .then(response => {
      hillchart.value = response.data.data;
    })
    .catch(error => console.log(error));

</script>

<template>
  <Frame v-if="hillchart" :frame="hillchart.frames[0]" :scopes="hillchart.scopes" />
  <p v-else>LOADING...</p>
</template>

import './assets/main.css'

import { createApp } from 'vue'

import App from './App.vue'

import client from './client'
import router from './router'

const app = createApp(App);

app.use(router);

app.provide('axios', client);

app.mount('#app');

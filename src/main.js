import './assets/main.css'

import { createApp } from 'vue'

import axios from 'axios';
import applyCaseMiddleware from 'axios-case-converter';

import App from './App.vue'

import router from './router'

const app = createApp(App);

app.use(router);

const client = applyCaseMiddleware(axios.create({
  baseURL: 'http://localhost:3000',
}));
app.provide('axios', client);

app.mount('#app');

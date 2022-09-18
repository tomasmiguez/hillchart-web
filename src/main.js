import { createApp } from 'vue'
import App from './App.vue'

import './assets/main.css'

import axios from 'axios';
import applyCaseMiddleware from 'axios-case-converter';

const app = createApp(App);

const client = applyCaseMiddleware(axios.create({
  baseURL: 'http://localhost:3000',
}));
app.provide('axios', client);

// app.config.errorHandler = (err) => {
//   alert(JSON.stringify(err));
// };

app.mount('#app');

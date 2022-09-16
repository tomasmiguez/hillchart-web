import { createApp } from 'vue'
import App from './App.vue'
import Hillchart from './components/Hillchart.vue'

import './assets/main.css'

const app = createApp(Hillchart);

app.config.errorHandler = (err) => {
  alert(JSON.stringify(err));
};

app.mount('#app');

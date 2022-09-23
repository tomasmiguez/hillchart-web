import axios from 'axios';
import applyCaseMiddleware from 'axios-case-converter';

const client = applyCaseMiddleware(axios.create({
  baseURL: 'https://hillchart-server.onrender.com',
}));

export default client;

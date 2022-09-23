import axios from 'axios';
import applyCaseMiddleware from 'axios-case-converter';

const client = applyCaseMiddleware(axios.create({
  // baseURL: 'http://localhost:3000',
  baseURL: 'https://1d46-190-190-12-185.ngrok.io',
}));

export default client;

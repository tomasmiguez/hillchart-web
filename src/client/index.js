import axios from 'axios';
import applyCaseMiddleware from 'axios-case-converter';

const client = applyCaseMiddleware(axios.create({
  baseURL: 'http://localhost:3000',
}));

export default client;

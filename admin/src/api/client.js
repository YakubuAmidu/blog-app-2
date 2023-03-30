// Imported axios
import axios from 'axios';

const client = axios.create({
    baseURL: 'http://localhost:8484/api'
});

export default client;
import axios from 'axios';

const client = axios.create({
    baseURL: "http://172.16.226.150:8484/api"
});

export default client;
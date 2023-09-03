import axios, { CreateAxiosDefaults } from "axios";

export const api = axios.create({
    withCredentials: true,
    baseURL: 'https://jsonplaceholder.typicode.com/',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
    }
} as CreateAxiosDefaults)
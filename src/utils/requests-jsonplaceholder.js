import { BASE_URLS } from './constants.js';
import http from 'k6/http';

export function getPosts() {
    return http.get(`${BASE_URLS.REST_API}/posts`);
}

export function getPost(id) {
    return http.get(`${BASE_URLS.REST_API}/posts/${id}`);
}

export function createPost(post) {
    return http.post(`${BASE_URLS.REST_API}/posts`, post);
}

export function updatePost(id, post) {
    return http.put(`${BASE_URLS.REST_API}/posts/${id}`, post);
}

export function deletePost(id) {
    return http.del(`${BASE_URLS.REST_API}/posts/${id}`);
}

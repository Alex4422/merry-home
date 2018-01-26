import axios from 'axios';
import openSocket from 'socket.io-client';

// const BASE_URL = 'http://172.16.16.105:4443';
const BASE_URL = 'http://localhost:4443';

const socket = openSocket(BASE_URL);

export { getRequestdata, sendRequest, getPluginsViews, subscribeToEvent, emitEvent };

function getRequestdata() {
    // console.log("GET REQUEST");
    const url = `${BASE_URL}/requests`;
    return axios.get(url).then(response => response.data);
}

function sendRequest(requestId, requestData) {
    // console.log("Send de la request post");
    const url = `${BASE_URL}/request/` + requestId;
    return axios.post(url, requestData).then(response => response.data);
}

function getPluginsViews() {
    // console.log("GET plugins");
    const url = `${BASE_URL}/plugins`;
    return axios.get(url).then(response => response.data);
}

function subscribeToEvent(name, callback) {
    socket.on(name, callback);
}

function emitEvent(name, data) {
    socket.emit(name, data);
}
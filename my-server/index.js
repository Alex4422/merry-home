'use strict';

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const cors = require('cors');
const bodyParser = require('body-parser');

const io = require('socket.io')(server, { pingTimeout: 30000 });

const port = 4443;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

import pluginController from './controllers/PluginController.js';

//Configure routes

//get all requests
app.get('/requests', pluginController.getAllPluginsRequests);

//get all plugins
app.get('/plugins', pluginController.getAllPluginsViews);

//post a request and get a response
app.post('/request/:requestId', pluginController.doRequest);

io.sockets.on('connection', (client) => {
    pluginController.addClientSocket(client);
});

server.listen(port);
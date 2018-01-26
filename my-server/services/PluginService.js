'use strict';

const fs = require('fs');
import EventEmitter from 'events';

class PluginService {
    constructor() {
        this.plugin = [];
        this.clientsSockets = [];
        this.pluginsEvents = new EventEmitter();
    }

    addClientSocket(client) {
        console.log("new client connected");
        for (var i in this.plugins) {
            this.plugins[i].suscribeEvent(client);
        }
        this.clientsSockets.push(client);
    }

    emitEvent(name, data) {
        for (var i in this.clientsSockets) {
            this.clientsSockets[i].emit(name, data);
        }
    }

    loadPlugins() {
        var pluginsFolder = './plugins';
        this.plugins = [];
        fs.readdir(pluginsFolder, (err, files) => {
            files.forEach(file => {
                console.log("load plugin ..." + file);
                var tmpPlugin = require('../' + pluginsFolder + '/' + file + '/index.js').default;
                tmpPlugin.setService(this);
                this.plugins.push(tmpPlugin);
            });
        });
    }

    getPluginsRequests() {
        var allRequests = {};
        for (var i in this.plugins) {
            for (var j in this.plugins[i].getRequests()) {
                allRequests[j] = this.plugins[i].getRequests()[j];
            }
        }
        return allRequests;
    }

    doPluginRequest(requestId, data) {
        var tmpPlugin = this.getPluginByRequestId(requestId);
        // console.log("tmpPlugin: ", tmpPlugin);
        if (tmpPlugin != null) {
            return tmpPlugin.doRequest(requestId, data);
        }
        return "Je ne comprends pas morray";
    }

    getPluginByRequestId(requestId) {
        for (var i in this.plugins) {
            for (var j in this.plugins[i].getRequests()) {
                if (requestId === j) {
                    return this.plugins[i];
                }
            }
        }
        return null;
    }

    getPluginsViews() {
        var allViews = [];
        for (var i in this.plugins) {
            if (this.plugins[i].getView()) {
                allViews.push(this.plugins[i].getView());
            }
        }
        return allViews;
    }

    getProgrammes() {
        let response = this.plugins['ProgrammeTvPlugin'].fetchProgramme();
        return 'ok';
    }
}

export default new PluginService();
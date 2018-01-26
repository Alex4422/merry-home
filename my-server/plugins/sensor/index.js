'use strict';

import Plugin from '../../models/Plugin.js';
import Sensor from './Sensor';

class SensorPlugin extends Plugin {

  constructor(path){
    super(path);
    this.sensors = [];
  }


  getView(){
    this.view.list = this.config.sensors;
    for(var i in this.view.list){
      this.view.list[i]['eventSubscribe'] = "serverSensor" + this.view.list[i].name + "Values";
    }
    return this.view;
  }

  setService(service) {
    this.service = service;
    for(var i in this.config.sensors){
      console.log(this.config.sensors[i].name);
      this.sensors[i] = new Sensor(this.config.sensors[i].name, this.config.sensors[i].period, this.config.sensors[i].script, this.service);
      this.sensors[i].start();
    }
  }
}

export default new SensorPlugin(__dirname);

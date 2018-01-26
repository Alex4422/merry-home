'use strict';

import Plugin from '../../models/Plugin.js';

class TimePlugin extends Plugin {

  doRequest(id, data){
    console.log("Request: "+ id);
    switch(id) {
      case "time":
        var now = new Date();
        var response = "Il est " + now.getHours()+ ":"+ now.getMinutes();
        console.log("Response: " + response);
        return response;
      case "issou":
        var response = "la chancla issou el banador";
        return response;
      case "fianso":
        var response = "iche iche";
        return response;
    }
    return null;
  }
}

export default new TimePlugin(__dirname);

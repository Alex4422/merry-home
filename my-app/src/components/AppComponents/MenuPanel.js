import React from 'react';
import {slide as Menu} from 'react-burger-menu';
import {getPluginsViews} from '../../utils/merryhome-api';

import PluginPanel from '../PluginsComponents/PluginPanel';
import {Glyphicon} from 'react-bootstrap';
import './css/MenuPanel.css';

class MenuPanel extends React.Component {

  constructor(){
    super();
    this.state = {
      plugins:[]
    };
  }

  getPlugins(){
    getPluginsViews().then((plugins) => {
      this.setState({plugins});
    }).catch(function(error){
      console.log(error);
    });
  }

  componentDidMount(){
    this.getPlugins();
  }

  render(){
    const plugins = this.state.plugins;
    return(
      <div>
        <Menu>
          <div className="menuPluginList">
          {plugins.map((plugin, index) => (
            <button key={"pluginLink-"+index} type="button"
                className="btn btn-info btn-lg" data-toggle="modal" data-target={"#plugin-"+index}>
              <Glyphicon glyph={plugin.linkicon}/>
              <span>{plugin.link}</span>
            </button>
          ))}
          {plugins.map((plugin, index) => (
            <PluginPanel key={"plugin-"+index} id={"plugin-"+index}
                         title={plugin.link} type={plugin.type} itemType={plugin.itemType} items={plugin.list}/>
          ))}
          </div>
        </Menu>
      </div>
    );
  }
}

export default MenuPanel;

import React from 'react';

import {subscribeToEvent, sendRequest} from '../../utils/merryhome-api';
// import { Glyphicon } from 'react-bootstrap';

import "./css/ProgrammePanel.css"

class ProgrammePanel extends React.Component {
    
    constructor(props){
        super(props);
        this.state = { values: {} };
        // console.log("subscribe to ", props.apiEventSubscribe);
        subscribeToEvent(props.apiEventSubscribe, (function (data){
            // console.log("received programme", JSON.parse(data));
            if(!data.error){
                let channelsProgramme = JSON.parse(data);
                channelsProgramme.programme = this.updateCurrentProgramme(channelsProgramme.programme);
                this.setState({values: channelsProgramme});
            }
        }).bind(this));
        this.tick();
    }

    componentWillMount() {
        // console.log("will mount programme");
        sendRequest('programme');
    }

    tick() {
        setInterval(() => {
            let date = new Date();
            if (date.getMinutes() % 5 === 0 || !(date.getMinutes() % 10)) {
                // console.log("update state");
                let currentState = this.state;
                currentState.values.programme = this.updateCurrentProgramme(this.state.values.programme);
                this.setState({values: currentState.values});
            }
        }, 1000);
    }

    updateCurrentProgramme(programmeList) {     
        let date = new Date();
        let programmeDate = new Date();
        programmeList.map((programme, index) => {
            let aTime = programme.time.split(':');
            programmeDate.setHours(aTime[0]);
            programmeDate.setMinutes(aTime[1]);
            if (programmeDate <= date) {
                programme.isCurrent = true;
                if (index > 0) {
                    programmeList[index - 1].isCurrent = false;
                }
            } else {
                programme.isCurrent = false;
            }
            return true;
        });
        
        return programmeList;
    }
    
    ListProgramme(props) {
        // console.log("List Programme", Object.keys(props.values).length);
        if (Object.keys(props.values).length > 0) {
            // console.log("state values",props.values);
            return (
                <div className="list-programme">
                    {props.values.channels.map((channel, index) => {
                        return (<div className="channel" key={index}>
                            <div className="channel-title flex-item">
                                <span className="channel-img"><img alt={channel.name} src={channel.image} /></span>                                
                            </div>
                            <div className="channel-programme flex-item">
                            {props.values.programme.map((programme, key) => {  
                                return (programme.channel === channel.name) ? 
                                    <div key={key} className={"item-programme" + (programme.isCurrent ? " active" : "")}>
                                        <span className="time">{programme.time}</span>
                                        <a href={programme.link} target="_blank" rel="nofollow" className="title">
                                            {programme.title}
                                        </a>
                                    </div>
                                : "";
                            })}
                            </div>
                        </div>)
                    })}
                </div>
            );
        } else {
            return (<div>En chargement</div>)
        }
        
    }

    
    render() {
        const ListProgramme = this.ListProgramme;
        // console.log("render programme panel");
        return (<div className="btn-get-programme">
            <ListProgramme values={this.state.values} />
            </div>);
    }
};

export default ProgrammePanel;
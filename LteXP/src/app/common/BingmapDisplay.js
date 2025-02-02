import React, { Component } from 'react';
import ReactBingmaps from 'components/ReactBingmaps';
import './BingmapDisplay.css';

class BingmapDisplay extends Component {
    constructor(props) {
        super(props);
    
    
        this.state = {
   
          bingmapKey: "AksOASfzdybmndjlOxhWnhZaNtzG5CMgqUFIgB5Ji8W6Gr748WQL5mijk5w4OmDD", //Don't use this key in your environment.
          infoboxesWithPushPins: JSON.parse(localStorage.getItem('map_info')) ? JSON.parse(localStorage.getItem('map_info')).map_data:null,

          driver_name: JSON.parse(localStorage.getItem('map_info')) ? JSON.parse(localStorage.getItem('map_info')).driver_name:null,
          avg_latitude: JSON.parse(localStorage.getItem('map_info')) ? JSON.parse(localStorage.getItem('map_info')).avg_latitude:43.651070,
          avg_longitude: JSON.parse(localStorage.getItem('map_info')) ? JSON.parse(localStorage.getItem('map_info')).avg_longitude:-79.347015,
        }
      }
   
    //   GetEventHandled(callbackData){
    //     console.log(callbackData);
    //   }
      render() {
        return (
          <div>
            <div>
              <h3 className="red-color">Please donnot refresh this page</h3>
              <h5>Driver Name: {this.state.driver_name}</h5>
              <div className="map-two">
                <ReactBingmaps
                  id = "four"
                  center = {[this.state.avg_latitude, this.state.avg_longitude]}
                  className = "customClass"
                  bingmapKey = {this.state.bingmapKey}
                  infoboxesWithPushPins = {this.state.infoboxesWithPushPins}
                >
                </ReactBingmaps>
              </div>
            </div>
            <br />
          </div>
        );
      }
}

export default BingmapDisplay;

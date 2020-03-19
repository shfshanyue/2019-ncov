import React, { useState, Suspense, useEffect } from "react";
import mapboxgl from 'mapbox-gl';
import confirmedData from "./data/mapdataCon"
import hospitalData from "./data/mapdataHos"
import ReactMapboxGl, {Layer, Feature, Popup} from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'
import confirmedImg from './icon/confirmed.png'
import hospitalImg from './icon/hospital.png'
let token = process.env.REACT_APP_MAP_API
mapboxgl.accessToken = token;
class MbMap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            lng: 133.751567,
            lat: -26.344589,
            zoom: 2.5
        };
    }

    componentDidMount() {
        const { lng, lat, zoom } = this.state;



        const map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/streets-v9',
            center: [lng, lat],
            minZoom:2.5,
            zoom
        });

        map.on('move', () => {
            const { lng, lat } = map.getCenter();

            this.setState({
                lng: lng.toFixed(4),
                lat: lat.toFixed(4),
                zoom: map.getZoom().toFixed(2)
            });
        });
        const noMargin = {margin:0};
        confirmedData.map((item)=> {
            // create a HTML element for each feature
            var el = document.createElement('div');
            el.className = 'marker';
            el.style.height = '20px';
            el.style.width = '20px';
            el.style.backgroundSize ='cover';
            el.style.backgroundImage = `url(${confirmedImg})`;
            el.style.borderRadius = '50%';
            el.style.cursor = 'pointer';



        //         = ({
        //         backgroundImage: 'url(icon/confirmed.png)',
        //     backgroundSize: 'cover',
        //     width: '50px',
        //     height: '50px',
        //     borderRadius: '50%',
        //     cursor: 'pointer'
        // });
            let coor = [item['coor'][1],item['coor'][0]]
            // make a marker for each feature and add to the map
            new mapboxgl.Marker(el)
                .setLngLat(coor)
                .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
                    .setHTML('<h3 style="margin:0;">'+item['name']+'</h3>'  + '<p style="margin:0;">' + item['date'] + '</p><p style="margin:0;">Activity Time: '+item['time']+'</p>'))
                .addTo(map);
        })

        hospitalData.map((item)=> {
            // create a HTML element for each feature
            var el = document.createElement('div');
            el.className = 'marker';
            el.style.height = '20px';
            el.style.width = '20px';
            el.style.backgroundSize ='cover';
            el.style.backgroundImage = `url(${hospitalImg})`;
            el.style.borderRadius = '50%';
            el.style.cursor = 'pointer';



            //         = ({
            //         backgroundImage: 'url(icon/confirmed.png)',
            //     backgroundSize: 'cover',
            //     width: '50px',
            //     height: '50px',
            //     borderRadius: '50%',
            //     cursor: 'pointer'
            // });
            let coor = [item['coor'][1],item['coor'][0]]
            // make a marker for each feature and add to the map
            new mapboxgl.Marker(el)
                .setLngLat(coor)
                .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
                    .setHTML('<h3 style="margin:0;">' + item['name'] + '</h3><p style="margin:0;">Phone: ' + item['phone'] + '</p><p style="margin:0;">Add: '+item['address']+'</p>'))

                .addTo(map);
        })
    }

    render() {
        const style = {
            height:'100%',

    };


        return (
            <div className="card" style={{
                display:'flex',
                flexDirection:'column',
                height:'520px'
            }}>
                <h2>Hospital & Cases Map</h2>

                <div style={style} ref={el => this.mapContainer = el} >
                    {/*{*/}
                        {/*confirmedData.map((item)=>(*/}
                            {/*<div style={activityStyle}>*/}

                            {/*</div>*/}
                        {/*))*/}
                    {/*}*/}
                </div>

                <span className="due">
        includes hospital with Fever Clinic and activities of confirmed cases (Keep updating).
        </span>
            </div>
        );
    }
}

export default MbMap
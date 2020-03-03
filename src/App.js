import React, { useState } from 'react';


import { Map, TileLayer, withLeaflet } from 'react-leaflet';
import { CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Sidebar, Tab } from 'react-leaflet-sidetabs';

import ApolloClient from "apollo-boost";
import { gql } from "apollo-boost";

import { ApolloProvider } from "react-apollo";
import {useQuery} from '@apollo/react-hooks';

import { FiChevronRight, FiSearch} from "react-icons/fi";

import L from 'leaflet';
import marker from 'leaflet/dist/images/marker-icon.png';
import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import VectorGridDefault from 'react-leaflet-vectorgrid';

const VectorGrid = withLeaflet(VectorGridDefault);

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: marker,
  shadowUrl: markerShadow
});


const client = new ApolloClient({
  uri: "https://cchdo.ucsd.edu/v1/graphql"
});


//const GET_LATEST_PROFILES = gql`
//        query LatestProfiles($number: Int!){
//          argo_profiles(limit: $number, order_by: {date: desc}, where: { _and: {geography: {_is_null: false}, date: {_is_null: false}}}) {
//            date
//            float_id
//            geography
//            file
//          }
//        }
//`;

const GET_GEO_PROFILES = gql`
  query GeoProfiles($geo: geography!, $startDate: timestamptz = "1990-01-01", $endDate: timestamptz = "2050-01-01") {
    argo_profiles(order_by: {date: desc}, where: {_and: {geography: {_st_d_within: {from: $geo, distance:10000}}, date: {_is_null: false, _gt: $startDate, _lt: $endDate}}}) {
      date
      float_id
      geography
      file
    }
  }
`;


const ArgoTable = ({ loading, error, data, geojson}) => {
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error ...</p>;


  async function profilesDownload(data){
    const {default: Zip} = await import("@transcend-io/conflux/write");
    const streamSaver = await import("streamsaver");

    const { writable } = new Zip();
    const writer = writable.getWriter();
    const base = "https://tmp.h2o.ucsd.edu/202002-ArgoData/dac/";
    const files = data.argo_profiles.map((prof) => prof.file).values()


    new ReadableStream({
      // pull gets executed whenever some
      // other stream request more data
      async pull(ctrl) {
        const { done, value } = files.next()
        if (done) {
          ctrl.enqueue({
            name: 'citation.txt',
            lastModified: new Date(0),
            stream: () => new Response('Argo (2020). Argo float data and metadata from Global Data Assembly Centre (Argo GDAC) - Snapshot of Argo GDAC of February 10st 2020. SEANOE. https://doi.org/10.17882/42182#70590').body
          })
          return ctrl.close()
        }
        const { body } = await fetch(base + value);
        ctrl.enqueue({
          name: `profiles/${value.split("/").pop()}`,
          stream: () => body
        })
      }
    })
    .pipeThrough(new Zip())
    .pipeTo(streamSaver.createWriteStream('argo_profiles.zip'));


    writer.close();
  }
  
  return (
    <>
    <h5>{data.argo_profiles.length} Profiles</h5>
    {("BigInt" in window)? <button onClick={(() => profilesDownload(data))}>Download Profiles</button> : <span>Bulk Download not supported</span>}
    <div>
    {data.argo_profiles.map(({file,  float_id, date, geography }) => (
    <div key={file}>
      <p>{float_id}: {date}<br /><small>{file}</small></p>
    </div>
  ))}
  </div>
  </>
  )
}

const Markers = ({ loading, error, data }) => {

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error ...</p>;

  const geojson = {
    "type": "FeatureCollection",
    "features": data.argo_profiles.map((float)=> {
      const {geography, ...props} = float;
      return {
      "type": "Feature",
      "geometry": geography,
      "properties": props
    }})
  }
  const options ={
    type: 'slicer',
    data: geojson,
    style: {
      radius: 4,
      weight: 0.5,
      opacity: 1,
      color: '#3388ff',
      fillColor: '#3388ff',
      fillOpacity: 0.6,
      fill: true,
      stroke: true
    },
    zIndex: 401,
    popup: (layer) => `<div><h3>Float ID: ${layer.properties.float_id}</h3>Profile Date: ${layer.properties.date}<br /><a href="https://tmp.h2o.ucsd.edu/202002-ArgoData/dac/${layer.properties.file}">Download netCDF</a></div>`,
  }

  return <VectorGrid {...options} />

}

function App() {

  const [collapsed, setCollapsed] = useState(false)
  const [selected, setSelected] = useState('firstten');
  const [startDate, setStartDate] = useState(new Date("1990-01-01"))
  const [endDate, setEndDate] = useState(new Date("2050-01-01"))

  //const [search, setSearch] = useState(new URLSearchParams(window.location.search))
  const [hash] = useState(window.location.hash)

  const geojson = decodeURIComponent(hash.slice(1))
  let geo;
  try {
    geo = JSON.parse(geojson)
  } catch (error) {
    geo = {}
    if (process.env.NODE_ENV === "development") {
      geo = {
        "type": "Feature",
        "properties": {
          "expocode": "318MTEST",
          "startDate": "2013-03-21",
          "endDate": "2013-05-01"
        },
        "geometry": {
          "type": "LineString",
          "coordinates": [[-212,37],[-126,38]]
        }
      }
    }
  }

  let cruiseStartDate, cruiseEndDate;
  try {
    cruiseStartDate = new Date(geo.properties.startDate)
    cruiseEndDate = new Date(`${geo.properties.endDate}T24:00:00Z`)
  } catch (error) {}

  const {loading, error, data } = useQuery(GET_GEO_PROFILES, {
    client: client,
    variables: {
      geo: geo.geometry,
      startDate: startDate,
      endDate: endDate
    }
  })


  return (
    <ApolloProvider client={client}>
      <div>
        <Sidebar
          id="sidebar"
          position="right"
          collapsed={collapsed}
          closeIcon={<FiChevronRight />}
          selected={selected}
          onOpen={(id) => { setSelected(id); setCollapsed(false) }}
          onClose={() => setCollapsed(true)}
        >
          <Tab id="firstten" header="Profile List" icon={<FiSearch />}>
            <div>
              <h4>Argo Profiles Near Cruise {geo.properties.expocode}</h4>
              <button onClick={() => {setStartDate(new Date("1990-01-01")); setEndDate(new Date("2050-01-01")) }}>Show Profiles from All Time</button><br />
              <button onClick={() => {setStartDate(cruiseStartDate); setEndDate(cruiseEndDate) }}>Show Profiles Durring Cruise Dates ({geo.properties.startDate}/{geo.properties.endDate})</button>
              <ArgoTable loading={loading} error={error} data={data} geojson={geo}/>
            </div>
          </Tab>
        </Sidebar>
        <Map className="mapStyle" center={[0, 0]} zoom={2}>
          <TileLayer attribute="" url={'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'} />
          <Markers loading={loading} error={error} data={data} />
        </Map>
      </div>
    </ApolloProvider>
  )
}

export default App;

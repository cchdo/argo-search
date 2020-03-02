import React, { useState } from 'react';


import { Map, TileLayer } from 'react-leaflet';
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
  query GeoProfiles($geo: geography!) {
    argo_profiles(order_by: {date: desc}, where: {_and: {geography: {_st_d_within: {from: $geo, distance:10000}}, date: {_is_null: false}}}) {
      date
      float_id
      geography
      file
    }
  }
`;


const ArgoTable = ({ loading, error, data }) => {
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error ...</p>;


  //const fileStream = streamSaver.createWriteStream('argo_profiles.zip');

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
            name: '/citation.txt',
            lastModified: new Date(0),
            stream: () => new Response('Argo (2020). Argo float data and metadata from Global Data Assembly Centre (Argo GDAC) - Snapshot of Argo GDAC of February 10st 2020. SEANOE. https://doi.org/10.17882/42182#70590').body
          })
          return ctrl.close()
        }
        const { body } = await fetch(base + value);
        ctrl.enqueue({
          name: `/profiles/${value.split("/").pop()}`,
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

  return data.argo_profiles.map(({file, float_id, geography }) => (
    <CircleMarker key={file} radius={4} center={[geography.coordinates[1], geography.coordinates[0]]}>
      <Popup>
        <h3>Argo Float: {float_id}</h3>

        <a href={"https://tmp.h2o.ucsd.edu/202002-ArgoData/dac/" +file}>Download Profile</a>
      </Popup>
    </CircleMarker>
  ));
}

function App() {

  const [collapsed, setCollapsed] = useState(false)
  const [selected, setSelected] = useState('firstten');
  //const [search, setSearch] = useState(new URLSearchParams(window.location.search))
  const [hash] = useState(window.location.hash)

  const line = decodeURIComponent(hash.slice(1))
  let geo;
  try {
    geo = JSON.parse(line)
  } catch (error) {
    geo = {}
  }

  const {loading, error, data } = useQuery(GET_GEO_PROFILES, {
    client: client,
    variables: {geo: geo}
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
              <ArgoTable loading={loading} error={error} data={data} />
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

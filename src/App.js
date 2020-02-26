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


const GET_LATEST_PROFILES = gql`
        query LatestProfiles($number: Int!){
          argo_profiles(limit: $number, order_by: {date: desc}, where: { _and: {geography: {_is_null: false}, date: {_is_null: false}}}) {
            date
            float_id
            geography
            file
          }
        }
`;

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


  return (
    <>
    <h5>{data.argo_profiles.length} Profiles</h5>
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

        <a href={"ftp://ftp.ifremer.fr/ifremer/argo/dac/" +file}>Download Profile</a>
      </Popup>
    </CircleMarker>
  ));
}

function App() {

  const [collapsed, setCollapsed] = useState(false)
  const [selected, setSelected] = useState('firstten');
  const [search, setSearch] = useState(new URLSearchParams(window.location.search))

  const line = search.get("line")
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

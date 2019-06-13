import React, { Component } from 'react';

import { Map, TileLayer } from 'react-leaflet';
import { CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Sidebar, Tab } from 'react-leaflet-sidetabs';

import ApolloClient from "apollo-boost";
import { gql } from "apollo-boost";

import { ApolloProvider } from "react-apollo";
import { Query } from "react-apollo";

import { FiHome, FiChevronRight, FiSearch, FiSettings } from "react-icons/fi";

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


const ArgoTable = ({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error ...</p>;

      return data.argo_profiles.map(({ float_id, date, geography }) => (
        <div key={float_id}>
          <p>{float_id}: {date}</p>
        </div>
      ));
}

const Markers = ({ loading, error, data }) => {

      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error ...</p>;

      return data.argo_profiles.map(({file, float_id, geography }) => (
        <CircleMarker key={file} radius={5} center={[geography.coordinates[1], geography.coordinates[0]]}>
          <Popup>
            <h3>Argo Float: {float_id}</h3>
            
            <a href={"ftp://ftp.ifremer.fr/ifremer/argo/dac/" +file}>Download Profile</a>
          </Popup>
        </CircleMarker>
      ));
}


class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      collapsed: false,
      selected: 'firstten'
    }
  }

  onClose() {
    this.setState({collapsed: true});
  }

  onOpen(id) {
    this.setState({
      collapsed: false,
      selected: id,
    })
  }

  render(){
    return(
      <ApolloProvider client={client}>
    <Query
      query={gql`
        {
          argo_profiles(limit: 50, order_by: {date: desc}, where: {date: {_is_null: false}}) {
            date
            float_id
            geography
            file
          }
        }
        `}>
      {(result) => {
        return (
          <div>
        <Sidebar
          id="sidebar"
          position="right"
          collapsed={this.state.collapsed}
          closeIcon={<FiChevronRight />}
          selected={this.state.selected}
          onOpen={this.onOpen.bind(this)}
          onClose={this.onClose.bind(this)}
          >
            <Tab id="firstten" header="First Fifty" icon={<FiSearch />}>
              <div>
                <ArgoTable {...result} />
              </div>
            </Tab>
          </Sidebar>
          <Map className="mapStyle" center={[0,0]} zoom={2}>
            <TileLayer attribute="" url={'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'} />
            <Markers {...result} />
          </Map>
        </div>
      )}}
      </Query>

        </ApolloProvider>
    )
  }
}

export default App;

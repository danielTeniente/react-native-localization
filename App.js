/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { PureComponent } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import Geolocation from '@react-native-community/geolocation';
import Polyline from '@mapbox/polyline';

class App extends PureComponent {
  //state = {lati:null,longi:null}
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: -0.1685769,
        longitude: -78.4849315,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      coords: [],
      marker: null,
    };

  }

  componentDidMount() {
    Geolocation.getCurrentPosition(position => {
      console.log(position.coords)
      this.setState({
        region: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },

      });
      console.log(this.state.region.latitude)
    }, error => alert(error.message),
      { timeout: 20000, maximumAge: 1000 }
    )
  }

  async getDirections(destLat, destLong) {
    try {
      let resp = await fetch('https://maps.googleapis.com/maps/api/directions/json?origin=' + this.state.region.latitude + ',' + this.state.region.longitude + '&destination=' + destLat + ',' + destLong + 'YOUR_API_KEY')
      let respJson = await resp.json();
      let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
      let coords = points.map((point, index) => {
        return {
          latitude: point[0],
          longitude: point[1]
        }
      })
      this.setState({
        coords: coords,

      })
      console.log(this.state.coords)
      
      return coords
    } catch (error) {
      console.log('Error:', error)
      return error
    }
  }


  render() {
    return (
      <MapView
        style={styles.map}
        region={this.state.region}
        showsUserLocation
        onPress={(event) => this.getDirections(event.nativeEvent.coordinate.latitude, event.nativeEvent.coordinate.longitude).then(this.setState({
          marker : event.nativeEvent.coordinate
        }))}
      >
        <MapView.Polyline
          coordinates={this.state.coords}
          strokeWidth={2}
          strokeColor="red" />
        
        {
          this.state.marker &&
          <MapView.Marker 
            coordinate = {this.state.marker}/>
        }

      </MapView>

    );
  }
}



const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
